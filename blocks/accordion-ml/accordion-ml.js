/*
 * Accordion Block
 * Recreate an accordion
 * https://www.hlx.live/developer/block-collection/accordion
 */

function multilevelAccordion(mainUL) {
    const mainLIs = mainUL.children;
    for (let i = 0; i < mainLIs.length; i++) {
        const mainLI = mainLIs[i];
        const mainA = mainLI.querySelector('a');

        const details = document.createElement('details');
        details.className = 'accordion-item';

        const summary = document.createElement('summary');
        summary.className = 'accordion-item-label';
        const labelRight = document.createElement('div');
        labelRight.classList.add('markerdiv');
        const lablDiv = document.createElement('div');
        lablDiv.append(mainA, labelRight);
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
    mainUL.querySelectorAll('details').forEach((details) => {
        details.addEventListener('toggle', (event) => {
            if (event.target.open) {
                console.log(event.target);
                details.parentElement.querySelectorAll('details').forEach((details) => {
                    if (details !== event.target) {
                        details.removeAttribute('open');
                    }
                });
            }
        });
    });
}


export default function decorate(block) {
    const mainUL = document.querySelector('ul');
    multilevelAccordion(mainUL);
    [...block.children].forEach((row) => {
        console.log(row);
    });
  }