/*
 * Copyright 2022 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

/*
 * Z-Pattern - v0.0.1
 */

function isOdd(num) { return num % 2 ? 'z-row-odd' : 'z-row-even'; }

function decorateButtons(el) {
  const buttons = el.querySelectorAll('em a, strong a');
  buttons.forEach((button) => {
    const parent = button.parentElement;
    const buttonType = parent.nodeName === 'STRONG' ? 'blue' : 'outline';
    button.classList.add('con-button', buttonType);
    parent.insertAdjacentElement('afterend', button);
    parent.remove();
  });
  if (buttons.length > 0) {
    buttons[0].closest('p').classList.add('action-area');
  }
}

function decorateIcons(el) {
  const regex = /[^{\{]+(?=}\})/g; // {{value}}
  const placeholders = el.textContent.match(regex);
  placeholders.forEach( (str) => {
    // todo: get this placeholder data from docs
    const svg = `<img width="40" alt="Adobe Illustrator CC icon" src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Adobe_Illustrator_CC_icon.svg/512px-Adobe_Illustrator_CC_icon.svg.png">`;
    const url = `#`;
    el.innerHTML = el.innerHTML.replace(`{{${str}}}`, `<a class="body-S icon ${str}" href="${url}">${svg} ${str.split('-')[1]}</a>`);
  });
  const icons = el.querySelectorAll('.icon');
  if (icons.length > 0) {
    icons[0].closest('p').classList.add('product-area');
  }
}

function decorateText(el, size) {
  const headings = el.querySelectorAll('h1, h2, h3, h4, h5, h6');
  const heading = headings[headings.length - 1];
  if (!size) {
    heading.classList.add('heading-XS');
    heading.nextElementSibling.classList.add('body-S');
    if (heading.previousElementSibling) {
      heading.previousElementSibling.classList.add('detail-M');
    }
  }
  if (size === 'm') {
    heading.classList.add('heading-M');
    heading.nextElementSibling.classList.add('body-S');
    if (heading.previousElementSibling) {
      heading.previousElementSibling.classList.add('detail-M');
    }
  }
  if (size === 'l') {
    heading.classList.add('heading-XL');
    heading.nextElementSibling.classList.add('body-M');
    if (heading.previousElementSibling) {
      heading.previousElementSibling.classList.add('detail-L');
    }
  }
}

function getBlockSize(el) {
  if (el.classList.contains('medium')) {
    return 'm';
  }else if (el.classList.contains('large')) {
    return 'l';
  }else{
    return null;
  }
}

export default function init(block)  {
    const children = block.querySelectorAll(':scope > div');
    if (children.length > 1) {
      console.log(children[0], children[0].childNodes.length);
      if(children[0].childNodes.length == 1) {
        children[0].classList.add('background');
        const bgImg = children[0].querySelector(':scope img');
        if (!bgImg) {
          const bgColor = children[0].textContent;
          block.style.background = bgColor;
          children[0].remove();
        }
      }
    }

    const size = getBlockSize(block);
    const media = block.querySelectorAll(':scope > div:not([class])');
    media.forEach((row, idx) => {
        row.classList.add(`media-row`);
        const text = row.querySelector('h1, h2, h3, h4, h5, h6').closest('div');
        text.classList.add('text');
        const image = row.querySelector(':scope > div:not([class])');
        if (image) {
          image.classList.add('image');
        }
        const rowLeftToRight = row.querySelector(':scope > div:first-of-type').classList.contains('text');
        if (rowLeftToRight) {
          row.classList.add(`media-row--ltr`);
        }

        decorateText(text, size);
        decorateIcons(text);
        decorateButtons(text);
    });

    const multiple = block.classList.contains('multiple');
    if(multiple) {
      const mediaContainer = document.createElement('div');
      mediaContainer.classList.add('media-container');
      media.forEach(function (row, index) {
        mediaContainer.append(row);
      });
      block.append(mediaContainer);
    }
}
