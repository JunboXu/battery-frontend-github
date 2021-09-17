<template>
  <div class="mainArea">
  </div>

</template>

<script>
import MainChartExample from './charts/MainChartExample'
import WidgetsDropdown from './widgets/WidgetsDropdown'
import WidgetsBrand from './widgets/WidgetsBrand'

export default {
  name: 'Dashboard',
  components: {
    MainChartExample,
    WidgetsDropdown,
    WidgetsBrand
  },

  data () {
    return {
    }
  },
  filters:{},
  mounted(){},
  methods: {
    color (value) {
      let $color
      if (value <= 25) {
        $color = 'info'
      } else if (value > 25 && value <= 50) {
        $color = 'success'
      } else if (value > 50 && value <= 75) {
        $color = 'warning'
      } else if (value > 75 && value <= 100) {
        $color = 'danger'
      }
      return $color
    },
    jumpTo(path){
      this.$router.push(path);
    },
  }
}
</script>
<style>
.mainArea{
  width: 100%;
  margin: auto;
  min-width: 800px;
}
.welcome{
  font-size: 16px;
  padding: 10px 0 0 10px;
}
.quickPathBox{
  display: flex;
  /* justify-content: ; */
}
.entrance{
    min-width: 180px;
    margin-right: 10px;
    cursor: pointer;
}
</style>