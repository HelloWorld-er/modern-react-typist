'use client';

import React, {useState, useEffect, isValidElement, cloneElement, Fragment, ReactNode, ReactElement} from "react";

type TreeNodeProps = React.PropsWithChildren<{ otherProps?: string }>;

interface TypistProps {
    children: ReactNode;
    cursor?: ReactElement;
    delay?: number;
    rootKey?: string;
}

export default function Typist({ children, cursor = <Fragment></Fragment>, delay = 100, rootKey = "typistRoot"}: TypistProps) {
    const cursorNode = cloneElement(cursor, {
        key: rootKey + "-cursor",
    })
    const [typedText, setTypedText] = useState<ReactNode | null>(null);

    class TreeNode {
        value: ReactNode;
        children: (TreeNode | string)[];

        constructor(value: ReactNode) {
            this.value = value;
            this.children = [];
        }

        addChild(child: TreeNode | string) {
            this.children.push(child);
        }
    }

    useEffect(() => {
        setTypedText(null);
        const rootTreeNode = new TreeNode(<Fragment></Fragment>);
        const treeNodeKeys: Record<string, TreeNode | string> = {[rootKey]: rootTreeNode};
        let charKeys: string[] = [];

        function formNodeTree(treeNode: TreeNode, node: ReactNode, keyPrefix: string) {
            if (isValidElement(node)) {
                const newKeyPrefix = keyPrefix + "/" + (treeNode.children.length);
                const clonedNode = cloneElement(node, {
                    key: newKeyPrefix,
                });
                treeNode.addChild(new TreeNode(clonedNode));
                treeNodeKeys[newKeyPrefix] = treeNode.children[treeNode.children.length - 1];
                const nodeProps = node.props as { children?: React.ReactNode };
                if  (nodeProps.children != null && typeof nodeProps.children[Symbol.iterator] === 'function') {
                    for (const child of React.Children.toArray(nodeProps.children)) {
                        formNodeTree(treeNode.children[treeNode.children.length - 1] as TreeNode, child, newKeyPrefix);
                    }
                }
                else formNodeTree(treeNode.children[treeNode.children.length - 1] as TreeNode, nodeProps.children, newKeyPrefix);
            }
            else if (Array.isArray(node)) {
                for (const child of node) {
                    formNodeTree(treeNode, child, keyPrefix);
                }
            }
            else if (typeof node === "string") {
                if (node.length === 1) {
                    treeNode.addChild(node);
                    const newKeyPrefix = keyPrefix + "/" + (treeNode.children.length - 1);
                    treeNodeKeys[newKeyPrefix] = treeNode.children[treeNode.children.length - 1];
                    charKeys.push(newKeyPrefix);
                }
                else {
                    const stringNode = new TreeNode(node);
                    treeNode.addChild(stringNode);
                    const newKeyPrefix = keyPrefix + "/" + (treeNode.children.length - 1);
                    treeNodeKeys[newKeyPrefix] = treeNode.children[treeNode.children.length - 1];
                    for (const char of node) {
                        formNodeTree(stringNode, char, newKeyPrefix);
                    }
                }
            }
        }

        formNodeTree(rootTreeNode, children, rootKey);
        let charKeyIndex = 0;


        const interval = setInterval(() => {
            const charKey = charKeys[charKeyIndex];
            const charKeyTreeIndex = charKey.split('/').slice(1).map(Number);
            let childNode = treeNodeKeys[charKey] as ReactNode;
            let addCursor = false;
            while (charKeyTreeIndex.length) {
                const nodes: (ReactNode | string)[] = [];
                const currentKeyPrefix = charKeyTreeIndex.length === 1 ? rootKey : rootKey + '/' + charKeyTreeIndex.slice(0, charKeyTreeIndex.length - 1).join('/');
                const currentKeyIndex = Number(charKeyTreeIndex[charKeyTreeIndex.length - 1]);
                for (let i = 0; i < currentKeyIndex; i ++) {
                    if (typeof treeNodeKeys[currentKeyPrefix + '/' + i] === "string") nodes.push(treeNodeKeys[currentKeyPrefix + "/" + i] as string);
                    else nodes.push((treeNodeKeys[currentKeyPrefix + '/' + i] as TreeNode).value);
                }
                nodes.push(childNode);
                if (typeof (treeNodeKeys[currentKeyPrefix] as TreeNode).value === "string") {
                    childNode = nodes.join("");
                }
                else {
                    if (!addCursor) {
                        nodes.push(cursorNode);
                        addCursor = true;
                    }
                    childNode = cloneElement((treeNodeKeys[currentKeyPrefix] as TreeNode).value as ReactElement<TreeNodeProps>, {
                        children: nodes
                    }) as ReactNode;
                }
                charKeyTreeIndex.pop();
            }
            setTypedText(childNode);
            charKeyIndex ++;
            if (charKeyIndex >= charKeys.length) {
                clearInterval(interval);
            }
        }, delay);

        return () => {
            clearInterval(interval);
        }
    }, [children, delay])

    return (
        <Fragment>
            {typedText}
        </Fragment>
    );
}
