export default async function decorate(block) {
  block.innerHTML = `<iframe
    id="ccFrame"
    src="https://customer.1mind.cloud/cc/embed-v8.html"
    allow="microphone https://customer.1mind.cloud; camera https://customer.1mind.cloud"
    sandbox="allow-scripts allow-forms allow-same-origin"
    style="width:100%; height:100vh; border:0;">
</iframe>`;
}
