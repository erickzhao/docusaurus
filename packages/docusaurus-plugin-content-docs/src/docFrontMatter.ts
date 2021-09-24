/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  JoiFrontMatter as Joi, // Custom instance for frontmatter
  URISchema,
  FrontMatterTagsSchema,
  validateFrontMatter,
} from '@docusaurus/utils-validation';
import {DocFrontMatter} from './types';

// NOTE: we don't add any default value on purpose here
// We don't want default values to magically appear in doc metadatas and props
// While the user did not provide those values explicitly
// We use default values in code instead
const DocFrontMatterSchema = Joi.object<DocFrontMatter>({
  id: Joi.string(),
  title: Joi.string().allow(''), // see https://github.com/facebook/docusaurus/issues/4591#issuecomment-822372398
  hide_title: Joi.boolean(),
  hide_table_of_contents: Joi.boolean(),
  keywords: Joi.array().items(Joi.string().required()),
  image: URISchema,
  description: Joi.string().allow(''), // see  https://github.com/facebook/docusaurus/issues/4591#issuecomment-822372398
  slug: Joi.string(),
  sidebar_label: Joi.string(),
  sidebar_position: Joi.number(),
  tags: FrontMatterTagsSchema,
  pagination_label: Joi.string(),
  custom_edit_url: URISchema.allow('', null),
  parse_number_prefixes: Joi.boolean(),
  toc_min_heading_level: Joi.number().when('toc_max_heading_level', {
    is: Joi.exist(),
    then: Joi.number().min(2).max(Joi.ref('toc_max_heading_level')),
    otherwise: Joi.number().min(2).max(6),
  }),
  toc_max_heading_level: Joi.number().min(2).max(6),
}).unknown();

export function validateDocFrontMatter(
  frontMatter: Record<string, unknown>,
): DocFrontMatter {
  return validateFrontMatter(frontMatter, DocFrontMatterSchema);
}
