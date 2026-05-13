export default async function decorate(block) {
  block.innerHTML = `<iframe
    id="ccFrame"
    src="https://customer.1mind.cloud/cc/embed-v9-prod.html"
    allow="microphone https://customer.1mind.cloud; camera https://customer.1mind.cloud"
    sandbox="allow-scripts allow-forms allow-same-origin allow-popups">
</iframe>`;
}
