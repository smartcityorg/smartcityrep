<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">

     <!-- <el-form-item label="employeeName" prop="employeeName">
       <el-input
         v-model="queryParams.employeeName"
         placeholder="请输入名称"
         clearable
         size="small"
         style="width: 240px"
         @keyup.enter.native="handleQuery"
       />
     </el-form-item> -->

     <el-form-item label="考勤时间">
       <el-date-picker
               v-model="queryParams.workStartTime"
               size="small"
               style="width: 140px"
               value-format="yyyy-MM-dd HH:mm:ss"
               start-placeholder="开始时间"
       /> ~
     <!-- </el-form-item>
     <el-form-item label="~"> -->
       <el-date-picker
               v-model="queryParams.workEndTime"
               size="small"
               style="width: 140px"
               value-format="yyyy-MM-dd HH:mm:ss"
               end-placeholder="结束时间"
       />
     </el-form-item>



      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <!-- <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button> -->
      </el-form-item>
    </el-form>


    <el-table v-loading="loading" :data="attenceList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column label="序号" align="center" prop="id" /> -->
      <el-table-column label="日期" align="center" prop="attendDateDesc" :show-overflow-tooltip="true" />
      <el-table-column label="姓名" align="center" prop="employeeName" :show-overflow-tooltip="true" />
      <el-table-column label="设备名称" align="center" prop="deviceName" :show-overflow-tooltip="true" />
      <el-table-column label="账户" align="center" prop="accountName" :show-overflow-tooltip="true" />
      <el-table-column label="上班考勤" align="center" prop="workStartTimeDesc" :show-overflow-tooltip="true" />
      <el-table-column label="考勤开始时间" align="center" prop="attendanceStartTimeDesc" :show-overflow-tooltip="true" />
      <el-table-column label="下班考勤" align="center" prop="workEndTimeDesc" :show-overflow-tooltip="true" />
      <el-table-column label="考勤结束时间" align="center" prop="attendanceEndTimeDesc" :show-overflow-tooltip="true" />

    </el-table>

   <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />


  </div>
</template>

<script>
import { listAttence, getAttence,exportAttence} from "@/api/sanitation/attence";
import { treeselect } from "@/api/system/area";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "Attence",
  components: { Treeselect },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      attenceList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        workStartTime: undefined,
        workEndTime: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  watch: {
    // 根据名称筛选区域树
    areaName(val) {
      this.$refs.tree.filter(val);
    }
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询考勤列表 */
    getList() {
      this.loading = true;
      listAttence(this.queryParams).then(response => {
          this.attenceList = response.data.list;
          this.total = response.data.total;
          this.loading = false;
        }
      );
    },

    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有考勤统计数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportAttence(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
