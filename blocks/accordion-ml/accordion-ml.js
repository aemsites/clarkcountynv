/*
 * Accordion Block
 * Recreate an accordion
 * https://www.hlx.live/developer/block-collection/accordion
 */

function multilevelAccordion(mainUL) {
    const mainLIs = mainUL.children;
    for (let i = 0; i < mainLIs.length; i++) {
      const mainLI = mainLIs[i];
      console.log(mainLI);
      const mainA = mainLI.querySelector('a');

      const details = document.createElement('details');
      details.className = 'accordion-item';

      const summary = document.createElement('summary');
      summary.className = 'accordion-item-label';
      const labelLeft = document.createElement('p');
      labelLeft.innerHTML = mainA.innerHTML;
      const labelRight = document.createElement('div');
      labelRight.classList.add('markerdiv');
      const lablDiv = document.createElement('div');
      lablDiv.append(labelLeft, labelRight);
      summary.append(lablDiv);

      const childUL = mainLI.querySelector('ul');

      if (childUL) {
        details.append(summary, childUL);
        mainLI.replaceWith(details);
        multilevelAccordion(childUL);
      } else {
        details.append(summary);
        mainLI.replaceWith(details)
      }
    }
  }


export default function decorate(block) {
    console.log(block);
    const mainUL = document.querySelector('ul');
    console.log(mainUL);
    multilevelAccordion(mainUL);
    [...block.children].forEach((row) => {
        console.log(row);
    });
  }