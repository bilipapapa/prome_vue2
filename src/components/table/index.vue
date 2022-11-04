<template>
  <el-table
    :data="tableData"
    border
    :stripe="stripe"
    ref="table"
    :height="tableAttribute.height"
    :show-header="tableAttribute.showHeader"
    :size="tableAttribute.size || 'small'"
    :header-row-class-name="tableAttribute.headerClass"
    highlight-current-row
    :span-method="ifMerge ? spanMethod : () => {}"
    :row-class-name="rowClass"
    :row-style="rowStyle"
    @cell-mouse-enter="cellMouseEnter"
    @cell-mouse-leave="cellMouseLeave"
    @current-change="currentChange"
    @row-dblclick="rowDbclick"
    @selection-change="selectionChange"
  >
    <el-table-column
      v-if="tableAttribute.type === 'selection' || tableAttribute.type === 'index'"
      align="center"
      width="60"
      :label="tableAttribute.type === 'index' ? '序号' : ''"
      :type="tableAttribute.type"
    >
    </el-table-column>
    <template v-for="item in tableAttribute.columns">
      <slot v-if="item.slot" :name="item.slot"></slot>
      <el-table-column
        v-else
        :key="item.prop"
        :prop="item.field"
        :label="item.label"
        :align="item.align || 'center'"
        :min-width="item.minWidth"
        :width="item.width"
        :class-name="item.class"
        :sortable="item.sortable || false"
        :formatter="item.formatter"
        show-overflow-tooltip
      >
      </el-table-column>
    </template>
  </el-table>
</template>

<script>
export default {
  props: {
    //表格属性
    tableAttribute: {
      type: Object,
      default: () => {
        return {
          type: '', //表格的type selection或者index
          height: window.innerHeight, //表格的高度
          size: '',
          showHeader: true, //  默认显示表头 boolean
          headerClass: '', //表格头部的类名
          tableEvents: '', //表格的事件
          columns: [] //表格的列
        }
      }
    },
    //表格数据
    tableData: {
      type: Array,
      default: () => []
    },
    //选中某行
    currentRow: {
      type: [Number, Object],
      default: -1 //-1时清空所选行
    },
    // 是否需要合并单元格
    ifMerge: {
      type: Boolean,
      default: false
    },
    // 要合并单元格的列
    mergeStyle: {
      type: Object,
      default() {
        return {}
      }
    },
    // 带斑马纹表格
    ifStripe: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      rowList: [],
      spanArr: {},
      pos: [], // 计算合并时记录位置
      selectRow: {}
    }
  },
  created() {
    // 有不同层次的合并单元格
    const spanNum = Object.keys(this.mergeStyle).length

    for (let i = 0; i < spanNum; i++) {
      const key = `col${i}`
      this.spanArr[key] = []
    }

    // 解决某个bug，在watch中直接immediate tableData会报错，而不加会不执行getSpanArr，所以直接在开始时就执行一遍
    if (this.ifMerge) {
      this.getSpanArr()
    }
  },
  beforeDestroy() {
    this.selectRow = {}
  },
  computed: {
    mergeKey() {
      return Object.keys(this.mergeStyle).length ? Object.keys(this.mergeStyle)[0] : ''
    },
    stripe() {
      return this.ifStripe && !this.ifMerge
    }
  },
  methods: {
    rowStyle({ row }) {
      if (row[this.mergeKey] && row[this.mergeKey] === this.selectRow[this.mergeKey]) {
        return { 'background-color': 'rgba(31,84,117)  !important' }
      }
    },
    //单机切换选择行
    currentChange(currentRow) {
      // 合并单元格选种样式问题
      if (currentRow) this.selectRow = currentRow
      this.$emit('radio', currentRow)
    },
    //双击事件
    rowDbclick(currentRow) {
      this.$emit('dbclick', currentRow)
    },
    selectionChange(selection) {
      this.$emit('selection', selection)
    },
    getSpanArr() {
      Object.keys(this.spanArr).forEach(key => {
        this.spanArr[key] = []
      })
      this.pos = [] // 刷新

      for (let i = 0; i < this.tableData.length; i++) {
        if (i === 0) {
          Object.keys(this.spanArr).forEach(key => {
            this.spanArr[key].push(1)
            this.pos.push(0)
          })
        } else {
          // 判断当前元素与上一个元素是否相同
          Object.keys(this.mergeStyle).forEach((prop, index) => {
            const key = `col${index}`

            if (this.tableData[i][prop] === this.tableData[i - 1][prop]) {
              this.spanArr[key][this.pos[index]] += 1
              this.spanArr[key].push(0)
            } else {
              this.spanArr[key].push(1)
              this.pos[index] = i
            }
          })
        }
      }
    },
    spanMethod({ row, column, rowIndex, columnIndex }) {
      const tmp = Object.values(this.mergeStyle)
      for (let i = 0; i < tmp.length; i++) {
        const key = `col${i}`
        if (tmp[i].includes(columnIndex)) {
          const _row = this.spanArr[key][rowIndex]
          const _col = _row > 0 ? 1 : 0

          return {
            rowspan: _row,
            colspan: _col
          }
        }
      }
    },
    rowClass({ row, rowIndex }) {
      if (this.rowList.length) {
        return this.rowList.some(
          item => item[this.mergeKey] && item[this.mergeKey] === row[this.mergeKey]
        )
          ? 'hover-row'
          : ''
      }
    },
    toggleRowSelection(list) {
      this.tableData.forEach(item => {
        var door = list.some(el => el.id === item.id)
        this.$refs['table'].toggleRowSelection(item, door)
      })
    },
    cellMouseEnter(row) {
      this.rowList = this.tableData.filter(item => item[this.mergeKey] === row[this.mergeKey])
    },
    cellMouseLeave() {
      this.rowList = []
    }
  },
  watch: {
    currentRow: {
      handler(val) {
        if (this.tableAttribute.tableEvents !== 'selection') {
          this.$refs['table'].setCurrentRow(val)
        }
      }
    },
    tableData: {
      handler() {
        if (this.ifMerge) {
          this.getSpanArr()
        }
      }
    }
  }
}
</script>
