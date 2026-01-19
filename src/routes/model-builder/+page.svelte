<script lang="ts">
  import { Divide, Mul, Symbol } from "$lib/MathMl";
  import { ModelBuilder } from "$lib/ModelBuilder";

  let builder = new ModelBuilder();
  builder.addVariable("x1", 1.0);
  builder.addVariable("x2", 2.0);
  builder.addParameter("kf", 1.0);
  builder.addParameter("keq", 2.0);
  builder.addDerived("kr", {
    fn: new Divide([new Symbol("kf"), new Symbol("keq")]),
    args: ["kf", "keq"],
  });
  builder.addReaction("r1", {
    fn: new Mul([new Symbol("kf"), new Symbol("x1")]),
    args: ["kf", "x1"],
    stoichiometry: { x1: -1.0, x2: 1.0 },
  });
  builder.addReaction("r2", {
    fn: new Mul([new Symbol("p2"), new Symbol("x2")]),
    args: ["kr", "x2"],
    stoichiometry: { x1: 1.0, x2: -1.0 },
  });
</script>

<h1>Model Builder</h1>
<pre>
    {builder.buildPython([])}
</pre>
<pre>
    {builder.buildPython(["kf"])}
</pre>
<pre>
    {builder.buildPython(["kf", "p2"])}
</pre>
