declare module "wat-compiler" {
  function wat2wasm(wat: string): Uint8Array;
  export default wat2wasm;
}
