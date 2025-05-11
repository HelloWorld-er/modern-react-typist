"use client";

import React, {useState, useEffect, isValidElement, cloneElement, Fragment} from "react";

export default function Typist({ children, cursor = <span className="animate-pulse mx-2">|</span>, delay = 100, rootKey = "typistRoot"}) {
    const cursorNode = cloneElement(cursor, {
        key: rootKey + "-cursor",
    })
    const [typedText, setTypedText] = useState(null);

    class TreeNode {
        constructor(value) {
            this.value = value;
            this.children = [];
        }

        addChild(child) {
            this.children.push(child);
        }
    }

    useEffect(() => {
        setTypedText(null);
        const rootTreeNode = new TreeNode(<Fragment></Fragment>);
        const treeNodeKeys = {[rootKey]: rootTreeNode};
        let charKeys = [];

        function formNodeTree(treeNode, node, keyPrefix) {
            if (isValidElement(node)) {
                const newKeyPrefix = keyPrefix + "/" + (treeNode.children.length);
                const clonedNode = cloneElement(node, {
                    key: newKeyPrefix,
                });
                treeNode.addChild(new TreeNode(clonedNode));
                treeNodeKeys[newKeyPrefix] = treeNode.children[treeNode.children.length - 1];
                if  (node.props.children != null && typeof node.props.children[Symbol.iterator] === 'function') {
                    for (const child of node.props.children) {
                        formNodeTree(treeNode.children[treeNode.children.length - 1], child, newKeyPrefix);
                    }
                }
                else formNodeTree(treeNode.children[treeNode.children.length - 1], node.props.children, newKeyPrefix);
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
                    treeNode.addChild(new TreeNode(node));
                    const newKeyPrefix = keyPrefix + "/" + (treeNode.children.length - 1);
                    treeNodeKeys[newKeyPrefix] = treeNode.children[treeNode.children.length - 1];
                    for (const char of node) {
                        formNodeTree(treeNode.children[treeNode.children.length - 1], char, newKeyPrefix);
                    }
                }
            }
        }

        formNodeTree(rootTreeNode, children, rootKey);
        let charKeyIndex = 0;


        const interval = setInterval(() => {
            const charKey = charKeys[charKeyIndex];
            const charKeyTreeIndex = charKey.split('/').slice(1).map(Number);
            let childNode = treeNodeKeys[charKey];
            let addCursor = false;
            while (charKeyTreeIndex.length) {
                const nodes = [];
                const currentKeyPrefix = charKeyTreeIndex.length === 1 ? rootKey : rootKey + '/' + charKeyTreeIndex.slice(0, charKeyTreeIndex.length - 1).join('/');
                const currentKeyIndex = Number(charKeyTreeIndex[charKeyTreeIndex.length - 1]);
                for (let i = 0; i < currentKeyIndex; i ++) {
                    if (typeof treeNodeKeys[currentKeyPrefix + '/' + i] === "string") nodes.push(treeNodeKeys[currentKeyPrefix + "/" + i]);
                    else nodes.push(treeNodeKeys[currentKeyPrefix + '/' + i].value);
                }
                nodes.push(childNode);
                if (typeof treeNodeKeys[currentKeyPrefix].value === "string") {
                    childNode = nodes.join("");
                }
                else {
                    if (!addCursor) {
                        nodes.push(cursorNode);
                        addCursor = true;
                    }
                    childNode = cloneElement(treeNodeKeys[currentKeyPrefix].value, {
                        children: nodes
                    })
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
        <>
            {typedText}
        </>
    );
}
