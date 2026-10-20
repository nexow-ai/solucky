/**
 * Regenerates the TypeScript client in clients/js/src/generated from the
 * program's IDL. Run `bun run program:build` first to refresh idl/solucky.json.
 */
import { type AnchorIdl, rootNodeFromAnchor } from '@codama/nodes-from-anchor';
import { renderVisitor } from '@codama/renderers-js';
import { createFromRoot } from 'codama';

import idl from '../idl/solucky.json' with { type: 'json' };

const codama = createFromRoot(rootNodeFromAnchor(idl as AnchorIdl));
await codama.accept(
  renderVisitor(new URL('../clients/js', import.meta.url).pathname, {
    kitImportStrategy: 'rootOnly',
    syncPackageJson: true,
  }),
);
console.log('Generated clients/js/src/generated');
