import { createSlice, nanoid } from '@reduxjs/toolkit';

const initialFileSystem = {
  id: 'root',
  name: 'root',
  type: 'folder',
  children: [
    {
      id: '1',
      name: 'src',
      type: 'folder',
      children: [
        { id: '2', name: 'index.js', type: 'file', content: 'console.log("hello world")' },
      ],
    },
    { id: '3', name: 'package.json', type: 'file', content: '{ "name": "my-project" }' },
  ],
};

const findNodeRecursively = (root, nodeId) => {
  if (root.id === nodeId) return { node: root, parent: null };
  if (!root.children) return { node: null, parent: null };

  for (const child of root.children) {
    if (child.id === nodeId) return { node: child, parent: root };
    if (child.type === 'folder') {
      const result = findNodeRecursively(child, nodeId);
      if (result.node) return result;
    }
  }
  return { node: null, parent: null };
};

const fileSystemSlice = createSlice({
  name: 'fileSystem',
  initialState: initialFileSystem,
  reducers: {
    createFile: (state, action) => {
      const { parentId, name, type } = action.payload;
      const { node: parent } = findNodeRecursively(state, parentId);
      if (parent && parent.type === 'folder') {
        parent.children.push({ id: nanoid(), name, type, children: type === 'folder' ? [] : undefined, content: type === 'file' ? '' : undefined });
      }
    },
    deleteItem: (state, action) => {
      const nodeId = action.payload;
      const { parent } = findNodeRecursively(state, nodeId);
      if (parent && parent.children) {
        parent.children = parent.children.filter(child => child.id !== nodeId);
      }
    },
    renameItem: (state, action) => {
      const { nodeId, newName } = action.payload;
      const { node } = findNodeRecursively(state, nodeId);
      if (node) {
        node.name = newName;
      }
    },
    moveItem: (state, action) => {
      const { sourceId, destinationId } = action.payload;
      const { node: sourceNode, parent: sourceParent } = findNodeRecursively(state, sourceId);
      const { node: destinationNode } = findNodeRecursively(state, destinationId);

      if (sourceNode && destinationNode && destinationNode.type === 'folder' && sourceParent) {
        sourceParent.children = sourceParent.children.filter(child => child.id !== sourceId);
        destinationNode.children.push(sourceNode);
      }
    },
    copyItem: (state, action) => {
        const { sourceId, destinationId } = action.payload;
        const { node: sourceNode } = findNodeRecursively(state, sourceId);
        const { node: destinationNode } = findNodeRecursively(state, destinationId);

        if (sourceNode && destinationNode && destinationNode.type === 'folder') {
            const copyNode = (node) => ({ ...node, id: nanoid(), children: node.children ? node.children.map(copyNode) : undefined });
            destinationNode.children.push(copyNode(sourceNode));
        }
    },
    updateFileContent: (state, action) => {
      const { fileId, content } = action.payload;
      const { node: file } = findNodeRecursively(state, fileId);
      if (file && file.type === 'file') {
        file.content = content;
      }
    },
  },
});

export const { createFile, deleteItem, renameItem, moveItem, copyItem, updateFileContent } = fileSystemSlice.actions;
export default fileSystemSlice.reducer;