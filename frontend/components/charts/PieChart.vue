<template>
  <div class="pie-chart" ref="chartdiv"></div>
</template>

<script>
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

export default {
  props: ['usedCapacity', 'maximumCapacity', 'usedCapacityText', 'maximumCapacityText'],
  mounted() {
    let root = am5.Root.new(this.$refs.chartdiv);

    root.setThemes([am5themes_Animated.new(root)]);

    let chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        layout: root.verticalHorizontal,
      })
    );

    // Define data
    let data = [
      {
        text: this.usedCapacityText,
        value: this.usedCapacity,
      },
      {
        text: this.maximumCapacityText,
        value: this.maximumCapacity - this.usedCapacity,
      },
    ];

    // Create series
    let series = chart.series.push(
      am5percent.PieSeries.new(root, {
        name: "Series",
        valueField: "value",
        categoryField: "text",
        alignLabels: false,
      })
    );

    series.labels.template.setAll({
      text: "{category}",
      textType: "circular",
      inside: true,
      radius: 10,
    });

    series.slices.template.set("tooltipText", "[bold]{valuePercentTotal.formatNumber('0.00')}%[/]");

    series.data.setAll(data);

    this.root = root;
  },

  beforeDestroy() {
    if (this.root) {
      this.root.dispose();
    }
  },
};
</script>

<style scoped>
.pie-chart {
  width: 100%;
  height: 250px;
}
</style>
