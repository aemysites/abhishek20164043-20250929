/*
 * Copyright 2024 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
/* global WebImporter */
/* eslint-disable no-console */
import cardsNoImages2Parser from './parsers/cardsNoImages2.js';
import columns1Parser from './parsers/columns1.js';
import columns3Parser from './parsers/columns3.js';
import cardsNoImages5Parser from './parsers/cardsNoImages5.js';
import columns4Parser from './parsers/columns4.js';
import cardsNoImages8Parser from './parsers/cardsNoImages8.js';
import cards6Parser from './parsers/cards6.js';
import carousel10Parser from './parsers/carousel10.js';
import carousel12Parser from './parsers/carousel12.js';
import columns7Parser from './parsers/columns7.js';
import columns11Parser from './parsers/columns11.js';
import cardsNoImages17Parser from './parsers/cardsNoImages17.js';
import columns18Parser from './parsers/columns18.js';
import columns16Parser from './parsers/columns16.js';
import cards20Parser from './parsers/cards20.js';
import columns21Parser from './parsers/columns21.js';
import columns22Parser from './parsers/columns22.js';
import cardsNoImages19Parser from './parsers/cardsNoImages19.js';
import cardsNoImages23Parser from './parsers/cardsNoImages23.js';
import columns24Parser from './parsers/columns24.js';
import cards26Parser from './parsers/cards26.js';
import cardsNoImages27Parser from './parsers/cardsNoImages27.js';
import cardsNoImages25Parser from './parsers/cardsNoImages25.js';
import columns30Parser from './parsers/columns30.js';
import columns28Parser from './parsers/columns28.js';
import cardsNoImages32Parser from './parsers/cardsNoImages32.js';
import columns29Parser from './parsers/columns29.js';
import cardsNoImages31Parser from './parsers/cardsNoImages31.js';
import cardsNoImages33Parser from './parsers/cardsNoImages33.js';
import columns35Parser from './parsers/columns35.js';
import columns34Parser from './parsers/columns34.js';
import cardsNoImages36Parser from './parsers/cardsNoImages36.js';
import hero37Parser from './parsers/hero37.js';
import columns38Parser from './parsers/columns38.js';
import cards39Parser from './parsers/cards39.js';
import columns41Parser from './parsers/columns41.js';
import cardsNoImages42Parser from './parsers/cardsNoImages42.js';
import carousel40Parser from './parsers/carousel40.js';
import cardsNoImages43Parser from './parsers/cardsNoImages43.js';
import cardsNoImages44Parser from './parsers/cardsNoImages44.js';
import cardsNoImages45Parser from './parsers/cardsNoImages45.js';
import cardsNoImages46Parser from './parsers/cardsNoImages46.js';
import cardsNoImages47Parser from './parsers/cardsNoImages47.js';
import cards48Parser from './parsers/cards48.js';
import hero50Parser from './parsers/hero50.js';
import columns49Parser from './parsers/columns49.js';
import headerParser from './parsers/header.js';
import metadataParser from './parsers/metadata.js';
import cleanupTransformer from './transformers/cleanup.js';
import imageTransformer from './transformers/images.js';
import linkTransformer from './transformers/links.js';
import sectionsTransformer from './transformers/sections.js';
import { TransformHook } from './transformers/transform.js';
import { customParsers, customTransformers, customElements } from './import.custom.js';
import {
  generateDocumentPath,
  handleOnLoad,
  mergeInventory,
} from './import.utils.js';

const parsers = {
  metadata: metadataParser,
  cardsNoImages2: cardsNoImages2Parser,
  columns1: columns1Parser,
  columns3: columns3Parser,
  cardsNoImages5: cardsNoImages5Parser,
  columns4: columns4Parser,
  cardsNoImages8: cardsNoImages8Parser,
  cards6: cards6Parser,
  carousel10: carousel10Parser,
  carousel12: carousel12Parser,
  columns7: columns7Parser,
  columns11: columns11Parser,
  cardsNoImages17: cardsNoImages17Parser,
  columns18: columns18Parser,
  columns16: columns16Parser,
  cards20: cards20Parser,
  columns21: columns21Parser,
  columns22: columns22Parser,
  cardsNoImages19: cardsNoImages19Parser,
  cardsNoImages23: cardsNoImages23Parser,
  columns24: columns24Parser,
  cards26: cards26Parser,
  cardsNoImages27: cardsNoImages27Parser,
  cardsNoImages25: cardsNoImages25Parser,
  columns30: columns30Parser,
  columns28: columns28Parser,
  cardsNoImages32: cardsNoImages32Parser,
  columns29: columns29Parser,
  cardsNoImages31: cardsNoImages31Parser,
  cardsNoImages33: cardsNoImages33Parser,
  columns35: columns35Parser,
  columns34: columns34Parser,
  cardsNoImages36: cardsNoImages36Parser,
  hero37: hero37Parser,
  columns38: columns38Parser,
  cards39: cards39Parser,
  columns41: columns41Parser,
  cardsNoImages42: cardsNoImages42Parser,
  carousel40: carousel40Parser,
  cardsNoImages43: cardsNoImages43Parser,
  cardsNoImages44: cardsNoImages44Parser,
  cardsNoImages45: cardsNoImages45Parser,
  cardsNoImages46: cardsNoImages46Parser,
  cardsNoImages47: cardsNoImages47Parser,
  cards48: cards48Parser,
  hero50: hero50Parser,
  columns49: columns49Parser,
  ...customParsers,
};

const transformers = [
  cleanupTransformer,
  imageTransformer,
  linkTransformer,
  sectionsTransformer,
  ...(Array.isArray(customTransformers)
    ? customTransformers
    : Object.values(customTransformers)),
];

// Additional page elements to parse that are not included in the inventory
const pageElements = [{ name: 'metadata' }, ...customElements];

WebImporter.Import = {
  findSiteUrl: (instance, siteUrls) => (
    siteUrls.find(({ id }) => id === instance.urlHash)
  ),
  transform: (hookName, element, payload) => {
    // perform any additional transformations to the page
    transformers.forEach((transformerFn) => (
      transformerFn.call(this, hookName, element, payload)
    ));
  },
  getParserName: ({ name, key }) => key || name,
  getElementByXPath: (document, xpath) => {
    const result = document.evaluate(
      xpath,
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null,
    );
    return result.singleNodeValue;
  },
  getFragmentXPaths: (
    { urls = [], fragments = [] },
    sourceUrl = '',
  ) => (fragments.flatMap(({ instances = [] }) => instances)
    .filter((instance) => {
      // find url in urls array
      const siteUrl = WebImporter.Import.findSiteUrl(instance, urls);
      if (!siteUrl) {
        return false;
      }
      return siteUrl.url === sourceUrl;
    })
    .map(({ xpath }) => xpath)),
};

/**
* Page transformation function
*/
function transformPage(main, { inventory, ...source }) {
  const { urls = [], blocks: inventoryBlocks = [] } = inventory;
  const { document, params: { originalURL } } = source;

  // get fragment elements from the current page
  const fragmentElements = WebImporter.Import.getFragmentXPaths(inventory, originalURL)
    .map((xpath) => WebImporter.Import.getElementByXPath(document, xpath))
    .filter((el) => el);

  // get dom elements for each block on the current page
  const blockElements = inventoryBlocks
    .flatMap((block) => block.instances
      .filter((instance) => WebImporter.Import.findSiteUrl(instance, urls)?.url === originalURL)
      .map((instance) => ({
        ...block,
        uuid: instance.uuid,
        section: instance.section,
        element: WebImporter.Import.getElementByXPath(document, instance.xpath),
      })))
    .filter((block) => block.element);

  const defaultContentElements = inventory.outliers
    .filter((instance) => WebImporter.Import.findSiteUrl(instance, urls)?.url === originalURL)
    .map((instance) => ({
      ...instance,
      element: WebImporter.Import.getElementByXPath(document, instance.xpath),
    }))
    .filter((block) => block.element);

  // remove fragment elements from the current page
  fragmentElements.forEach((element) => {
    if (element) {
      element.remove();
    }
  });

  // before page transform hook
  WebImporter.Import.transform(TransformHook.beforePageTransform, main, { ...source });

  // transform all elements using parsers
  [...defaultContentElements, ...blockElements, ...pageElements]
    // sort elements by order in the page
    .sort((a, b) => (a.uuid ? parseInt(a.uuid.split('-')[1], 10) - parseInt(b.uuid.split('-')[1], 10) : 999))
    // filter out fragment elements
    .filter((item) => !fragmentElements.includes(item.element))
    .forEach((item, idx, arr) => {
      const { element = main, ...pageBlock } = item;
      const parserName = WebImporter.Import.getParserName(pageBlock);
      const parserFn = parsers[parserName];
      try {
        let parserElement = element;
        if (typeof parserElement === 'string') {
          parserElement = main.querySelector(parserElement);
        }
        // before parse hook
        WebImporter.Import.transform(
          TransformHook.beforeParse,
          parserElement,
          {
            ...source,
            ...pageBlock,
            nextEl: arr[idx + 1],
          },
        );
        // parse the element
        if (parserFn) {
          parserFn.call(this, parserElement, { ...source });
        }
        // after parse hook
        WebImporter.Import.transform(
          TransformHook.afterParse,
          parserElement,
          {
            ...source,
            ...pageBlock,
          },
        );
      } catch (e) {
        console.warn(`Failed to parse block: ${parserName}`, e);
      }
    });
}

/**
* Fragment transformation function
*/
function transformFragment(main, { fragment, inventory, ...source }) {
  const { document, params: { originalURL } } = source;

  if (fragment.name === 'nav') {
    const navEl = document.createElement('div');

    // get number of blocks in the nav fragment
    const navBlocks = Math.floor(fragment.instances.length / fragment.instances.filter((ins) => ins.uuid.includes('-00-')).length);
    console.log('navBlocks', navBlocks);

    for (let i = 0; i < navBlocks; i += 1) {
      const { xpath } = fragment.instances[i];
      const el = WebImporter.Import.getElementByXPath(document, xpath);
      if (!el) {
        console.warn(`Failed to get element for xpath: ${xpath}`);
      } else {
        navEl.append(el);
      }
    }

    // body width
    const bodyWidthAttr = document.body.getAttribute('data-hlx-imp-body-width');
    const bodyWidth = bodyWidthAttr ? parseInt(bodyWidthAttr, 10) : 1000;

    try {
      const headerBlock = headerParser(navEl, {
        ...source, document, fragment, bodyWidth,
      });
      main.append(headerBlock);
    } catch (e) {
      console.warn('Failed to parse header block', e);
    }
  } else {
    (fragment.instances || [])
      .filter((instance) => {
        const siteUrl = WebImporter.Import.findSiteUrl(instance, inventory.urls);
        if (!siteUrl) {
          return false;
        }
        return `${siteUrl.url}#${fragment.name}` === originalURL;
      })
      .map(({ xpath }) => ({
        xpath,
        element: WebImporter.Import.getElementByXPath(document, xpath),
      }))
      .filter(({ element }) => element)
      .forEach(({ xpath, element }) => {
        main.append(element);

        const fragmentBlock = inventory.blocks
          .find(({ instances }) => instances.find((instance) => {
            const siteUrl = WebImporter.Import.findSiteUrl(instance, inventory.urls);
            return `${siteUrl.url}#${fragment.name}` === originalURL && instance.xpath === xpath;
          }));

        if (!fragmentBlock) return;
        const parserName = WebImporter.Import.getParserName(fragmentBlock);
        const parserFn = parsers[parserName];
        if (!parserFn) return;
        try {
          parserFn.call(this, element, source);
        } catch (e) {
          console.warn(`Failed to parse block: ${fragmentBlock.key}, with xpath: ${xpath}`, e);
        }
      });
  }
}

export default {
  onLoad: async (payload) => {
    await handleOnLoad(payload);
  },

  transform: async (payload) => {
    const { document, params: { originalURL } } = payload;

    /* eslint-disable-next-line prefer-const */
    let publishUrl = window.location.origin;
    // $$publishUrl = '{{{publishUrl}}}';

    let inventory = null;
    // $$inventory = {{{inventory}}};
    if (!inventory) {
      const siteUrlsUrl = new URL('/tools/importer/site-urls.json', publishUrl);
      const inventoryUrl = new URL('/tools/importer/inventory.json', publishUrl);
      try {
        // fetch and merge site-urls and inventory
        const siteUrlsResp = await fetch(siteUrlsUrl.href);
        const inventoryResp = await fetch(inventoryUrl.href);
        const siteUrls = await siteUrlsResp.json();
        inventory = await inventoryResp.json();
        inventory = mergeInventory(siteUrls, inventory, publishUrl);
      } catch (e) {
        console.error('Failed to merge site-urls and inventory');
      }
      if (!inventory) {
        return [];
      }
    }

    let main = document.body;

    // before transform hook
    WebImporter.Import.transform(TransformHook.beforeTransform, main, { ...payload, inventory });

    // perform the transformation
    let path = null;
    const sourceUrl = new URL(originalURL);
    const fragName = sourceUrl.hash ? sourceUrl.hash.substring(1) : '';
    if (fragName) {
      // fragment transformation
      const fragment = inventory.fragments.find(({ name }) => name === fragName);
      if (!fragment) {
        return [];
      }
      main = document.createElement('div');
      transformFragment(main, { ...payload, fragment, inventory });
      path = fragment.path;
    } else {
      // page transformation
      transformPage(main, { ...payload, inventory });
      path = generateDocumentPath(payload, inventory);
    }

    // after transform hook
    WebImporter.Import.transform(TransformHook.afterTransform, main, { ...payload, inventory });

    return [{
      element: main,
      path,
    }];
  },
};
