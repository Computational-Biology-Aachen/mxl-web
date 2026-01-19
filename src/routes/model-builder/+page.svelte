<script lang="ts">
  import { Mul, Symbol } from "$lib/MathMl";
  import { ModelBuilder } from "$lib/ModelBuilder";

  let builder = new ModelBuilder();
  builder.addVariable("x1", 1.0);
  builder.addVariable("x2", 2.0);
  builder.addParameter("p1", 1.0);
  builder.addParameter("p2", 2.0);
  builder.addReaction("r1", {
    fn: new Mul([new Symbol("p1"), new Symbol("x1")]),
    args: ["p1", "x1"],
    stoichiometry: { x1: -1.0, x2: 1.0 },
  });
  builder.addReaction("r2", {
    fn: new Mul([new Symbol("p2"), new Symbol("x2")]),
    args: ["p2", "x2"],
    stoichiometry: { x1: 1.0, x2: -1.0 },
  });
</script>

<h1>Model Builder</h1>
<pre>
    {builder.buildPython([])}
</pre>
<pre>
    {builder.buildPython(["p1"])}
</pre>
<pre>
    {builder.buildPython(["p1", "p2"])}
</pre>
