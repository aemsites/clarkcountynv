export default async function decorate(block) {
  block.innerHTML = `<iframe
    class="oneMindEmbed"
    id="ccFrame"
    src="https://customer.1mind.cloud/cc/embed-v8.html"
    allow="microphone https://customer.1mind.cloud; camera https://customer.1mind.cloud"
    sandbox="allow-scripts allow-forms allow-same-origin">
</iframe>`;
}
