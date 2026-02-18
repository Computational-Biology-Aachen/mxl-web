<script lang="ts">
  import Icon from "$lib/Icon.svelte";
  import ArrNum from "./ArrNum.svelte";
  import ArrObj from "./ArrObj.svelte";
  import Deferred from "./Deferred.svelte";
  import Num from "./Num.svelte";

  let a = $state(1.0);
  let l = $state([1.0]);
  let lo = $state([{ value: 1.0 }]);
  let lo2 = $state([{ inner: { value: 1.0 } }]);
  let ld = $state([{ value: 1.0 }]);
</script>

<h1>Svelte reactivity cheat sheet</h1>
<p>
  I'm sometimes confused as to which assignments actually update, so here is a
  collection of approaches.
</p>

<!--

-->

<h2>Direct variable update <Icon>check</Icon></h2>
<p>
  Easy, the default case. Note that if you want to updates to the value in the
  container bubbling upwards you need the `bind` directive (value semantics).
</p>
<pre>
    let a = $state(1.0);
    onclick=&lbrace;() => (a = a + 1)&rbrace;
</pre>
<div class="row">
  <span>a = {a}</span>
  <Num value={a}></Num>
  <Num
    bind:value={a}
    isBound
  ></Num>
  <button onclick={() => (a = a + 1)}>Assign to variable</button>
</div>

<!--

-->

<h2>Updating collection of num <Icon>check</Icon></h2>
<p>
  Still easy, the default case. Note that one *should* need the `bind` directive
  to have updates bubble up, but due to reference semantics it still works
  without. Probably not a great idea to rely on this. Also should break once
  someone replaces the entire array (different pointer).
</p>
<pre>
    let l = $state([1.0]);
    onclick=&lbrace;() => (l[0] = l[0] + 1)&rbrace;
</pre>
<div class="row">
  <span>l = {l[0]}</span>
  <ArrNum value={l} />
  <ArrNum
    bind:value={l}
    isBound
  />
  <button onclick={() => (l[0] = l[0] + 1)}>Assign to variable</button>
</div>

<!--

-->

<h2>Updating collection of obj <Icon>check</Icon></h2>
<pre>{`
let lo = $state([{ value: 1.0 }]);
// Either replace complete object
<button onclick={() => (lo[0] = { value: lo[0].value + 1 })} ...
// Or use deep reactivity
<button onclick={() => (lo[0].value = lo[0].value + 1)} ...
`.trim()}</pre>
<div class="row">
  <span>lo = {lo[0].value}</span>
  <ArrObj value={lo} />
  <ArrObj
    bind:value={lo}
    isBound
  />
  <button onclick={() => (lo[0] = { value: lo[0].value + 1 })}
    >Replace entire object</button
  >
  <button onclick={() => (lo[0].value = lo[0].value + 1)}
    >Deep reactivity</button
  >
</div>

<!--

-->

<h2>Deeper reactivity <Icon>check</Icon></h2>
<p>Deep reactivity still works multiple layers down</p>
<pre>{`
let lo2 = $state([{ inner: { value: 1.0 } }]);
<button onclick={() => (lo[0].value = lo[0].value + 1)} ...
`.trim()}</pre>
<div class="row">
  <span>lo = {lo2[0].inner.value}</span>
  <button onclick={() => (lo2[0].inner.value = lo2[0].inner.value + 1)}
    >Deep reactivity</button
  >
</div>

<!--

-->

<h2>Deferred update with callback <Icon>check</Icon></h2>
<p>
  The idea here is to defer updates to the outer variable and only update on
  callback. Useful, when the component might introduce temporary broken state or
  if updates are expensive.
</p>
<pre>{`
  let internal = $state<Data>([]);
  $effect(() => {
    internal = parent.slice();
  });
`}</pre>
<div class="row">
  <span>ld = {ld[0].value}</span>
  <Deferred
    parent={ld}
    callback={(data) => {
      ld = data;
    }}
  />
  <button onclick={() => (ld[0] = { value: ld[0].value + 1 })}
    >Assign to variable</button
  >
</div>
