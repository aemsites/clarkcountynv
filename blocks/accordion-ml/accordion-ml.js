/*
 * Accordion Block
 * Recreate an accordion
 * https://www.hlx.live/developer/block-collection/accordion
 */

function multilevelAccordion(mainUL) {
    let counter = 0;
    const mainLIs = mainUL.children;
    for (let i = 0; i < mainLIs.length; i++) {
        const mainLI = mainLIs[i];
        const mainA = mainLI.querySelector('a');

        const details = document.createElement('details');
        details.classList.add('accordion-item');

        const summary = document.createElement('summary');
        summary.classList.add('accordion-item-label');
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
}

function findLevel(element) {
    let level = 0;
    while (element.parentElement) {
        if (element.parentElement.tagName === 'UL') {
            level++;
        }
        element = element.parentElement;
    }
    return level;
}

export default function decorate(block) {
    const mainUL = document.querySelector('ul');
    const level = 1;
    multilevelAccordion(mainUL);
    [...block.children].forEach((row) => {
        console.log(row);
    });

    console.log(mainUL);
    mainUL.querySelectorAll('details').forEach((details) => {
        details.addEventListener('toggle', (event) => {
            if (event.target.open) {
                const value = findLevel(event.target);
                console.log(value);
                event.target.querySelector('ul').querySelectorAll(':scope > details').forEach((details) => {
                    details.querySelector('summary').classList.add('itemcolor'+(value+1)); 
                });
                details.parentElement.querySelectorAll('details').forEach((details) => {
                    if (details !== event.target) {
                        details.removeAttribute('open');
                    }
                });
            }
        });
    });

    console.log(block.querySelector('details').getAttribute('open', ''));
  }