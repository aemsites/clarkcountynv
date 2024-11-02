/*
 * Accordion Block
 * Recreate an accordion
 * https://www.hlx.live/developer/block-collection/accordion
 */

function multilevelAccordion(mainUL, itemClass, labelClass, level) {
    const mainLIs = mainUL.children;
    for (let i = 0; i < mainLIs.length; i++) {
        const mainLI = mainLIs[i];
        const mainA = mainLI.querySelector('a');

        const details = document.createElement('details');
        details.className = `${itemClass}`;

        const summary = document.createElement('summary');
        summary.className = `${labelClass}`;
        const labelRight = document.createElement('div');
        labelRight.classList.add('markerdiv');
        const lablDiv = document.createElement('div');
        lablDiv.append(mainA, labelRight);
        summary.append(lablDiv);

        const childUL = mainLI.querySelector('ul');

        if (childUL) {
            level++;
            details.append(summary, childUL);
            mainLI.replaceWith(details);
            const newitemClass = `accordion-item-level${level}`;
            const newlabelClass = `accordion-item-label-level${level}`;
            multilevelAccordion(childUL, newitemClass, newlabelClass, level);
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
    const level = 1;
    multilevelAccordion(mainUL, 'accordion-item-level1', 'accordion-item-label-level1', level);
    [...block.children].forEach((row) => {
        console.log(row);
    });
  }