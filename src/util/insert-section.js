import remark from 'remark';

function sectionInsertTransform(newContent, { priority = 100 } = {}) {
  return () =>
    function transformer(tree) {
      let firstDef = tree.children.findIndex(
        ({ type }) => type === 'definition'
      );
      if (firstDef === -1) firstDef = tree.children.length;

      const originalContent = tree.children.slice(0, firstDef);
      const defs = tree.children.slice(firstDef);

      const headerCount = Math.max(
        tree.children.filter(({ type }) => type === 'heading').length - 1
      );
      const headerIndex = Math.floor((priority * headerCount) / 100);
      let headerAccum = -1;
      let headerSplitPoint = Infinity;
      tree.children.some((child, idx) => {
        if (child.type !== 'heading') return false;
        if (headerAccum === headerIndex) {
          headerSplitPoint = idx;
          headerAccum++;
          return true;
        }

        headerAccum++;
        return false;
      });

      tree.children = [
        ...originalContent.slice(0, headerSplitPoint),
        newContent,
        ...originalContent.slice(headerSplitPoint),
        ...defs,
      ];
    };
}

export default function insertSection(originalContent, newContent, opts) {
  const newAst = remark().parse(newContent);
  return new Promise((resolve, reject) => {
    remark()
      .use(sectionInsertTransform(newAst, opts))
      .process(originalContent, (err, result) =>
        err ? reject(err) : resolve(String(result))
      );
  });
}
