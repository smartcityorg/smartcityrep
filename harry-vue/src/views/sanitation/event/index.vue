<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">

    <el-form-item label="事件类型" prop="qualityType">
     <el-select v-model="queryParams.qualityType" placeholder="事件类型" clearable >
       <el-option
         v-for="dict in qualityTypeOptions"
         :key="dict.dictValue"
         :label="dict.dictLabel"
         :value="dict.dictValue"
       />
     </el-select>
    </el-form-item>

    <el-form-item label="状态" prop="eventStatus">
     <el-select v-model="queryParams.eventStatus" placeholder="状态" clearable >
       <el-option
         v-for="dict in statusOptions"
         :key="dict.dictValue"
         :label="dict.dictLabel"
         :value="dict.dictValue"
       />
     </el-select>
    </el-form-item>



      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>


    <el-table v-loading="loading" :data="eventList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" align="center" prop="id" />
      <el-table-column label="事件类型" align="center" prop="qualityType" :formatter="qualityTypeFormat" />
      <el-table-column label="当前状态" align="center" prop="eventStatus" :formatter="statusFormat" />
      <el-table-column label="负责人" align="center" prop="leader" :show-overflow-tooltip="true" />
      <el-table-column label="部件名称" align="center" prop="partsName" :show-overflow-tooltip="true" />
      <!-- <el-table-column label="照片" align="center" prop="phone" :show-overflow-tooltip="true" /> -->
      <el-table-column label="来源" align="center" prop="source" :formatter="sourceFormat" />
      <el-table-column label="上报人" align="center" prop="reportPerson" :show-overflow-tooltip="true" />
      <el-table-column label="上报时间" align="center" prop="reportTime" :show-overflow-tooltip="true" />

 <el-table-column label="操作" align="center" >
        <template slot-scope="scope">
            <el-button
                    size="mini"
                    circle type="info"
                    icon="el-icon-view"
                    @click="handleView(scope.row,scope.index)"
                    v-hasPermi="['sanitation:event:query']"
            />
        </template>
      </el-table-column>

    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

     <!-- 事件详细 -->
     <el-dialog title="事件详细" :visible.sync="open" width="700px">
       <el-form ref="form" :model="form" label-width="100px" size="mini">
         <el-row>
           <el-col :span="12">
             <el-form-item label="事件类型：">{{ qualityTypeFormat(form) }}</el-form-item>
             <el-form-item label="当前状态：">{{ statusFormat(form) }}</el-form-item>
           </el-col>
           <el-col :span="12">
             <el-form-item label="上报位置：">{{ form.reportingLocation }}</el-form-item>
             <el-form-item label="派发类型：">{{ distributeTypeFormat(form) }}</el-form-item>
           </el-col>
           <el-col :span="12">
             <el-form-item label="部件：">{{ form.partsName }}</el-form-item>
             <el-form-item label="部件负责人：">{{ form.leader }}</el-form-item>
           </el-col>
           <el-col :span="12">
             <el-form-item label="上报人：">{{ form.reportPerson }}</el-form-item>
             <el-form-item label="上报时间：">{{ form.reportTime }}</el-form-item>
           </el-col>
           <el-col :span="12">
             <el-form-item label="派发时间：">{{ form.distributionTime }}</el-form-item>
             <el-form-item label="处理人：">{{ form.handlerPerson }}</el-form-item>
           </el-col>
           <el-col :span="12">
             <el-form-item label="处理时间：">{{ form.handlerTime }}</el-form-item>
             <el-form-item label="处理时长：">{{ form.handlerDuration }}</el-form-item>
           </el-col>
           <el-col :span="12">
             <el-form-item label="是否超时：">
               <div v-if="form.isTimeout === '1'">是</div>
               <div v-else-if="form.isTimeout === '0'">否</div>
             </el-form-item>
           </el-col>
           <el-col :span="24">
             <el-form-item label="事件内容：">{{form.qualityContent}}</el-form-item>
           </el-col>
           <el-col :span="12">
             <el-form-item label="事件描述：">{{form.eventDesc}}</el-form-item>
           </el-col>
          <!-- <el-col :span="24">
             <el-form-item label="异常信息：" v-if="form.status === 1">{{ form.errorMsg }}</el-form-item>
           </el-col> -->
         </el-row>
       </el-form>
       <div slot="footer" class="dialog-footer">
         <el-button @click="open = false">关 闭</el-button>
       </div>
     </el-dialog>

  </div>
</template>

<script>
import { listEvent, getEvent} from "@/api/sanitation/event";

export default {
  name: "Event",
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
      eventList: [],
      qualityTypeOptions: [],
      statusOptions: [],
      sourceOptions: [],
      distributeTypeOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        qualityType: undefined,
        eventStatus: undefined
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
    this.getDicts("quality_type").then(response => {
      this.qualityTypeOptions = response.data;
    });
    this.getDicts("event_status").then(response => {
      this.statusOptions = response.data;
    });
    this.getDicts("event_source").then(response => {
      this.sourceOptions = response.data;
    });
    this.getDicts("distribute_type").then(response => {
      this.distributeTypeOptions = response.data;
    });
  },
  methods: {
    /** 查询巡查排班列表 */
    getList() {
      this.loading = true;
      listEvent(this.addDateRange(this.queryParams, this.dateRange)).then(response => {

          this.eventList = response.data.list;
          this.total = response.data.total;
          this.loading = false;
        }
      );
    },
    qualityTypeFormat(row, column) {
      return this.selectDictLabel(this.qualityTypeOptions, row.qualityType);
    },
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.eventStatus);
    },
    sourceFormat(row, column) {
      return this.selectDictLabel(this.sourceOptions, row.source);
    },
    distributeTypeFormat(row, column) {
      return this.selectDictLabel(this.distributeTypeOptions, row.distributeType);
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
    /** 详细按钮操作 */
    handleView(row) {
      this.open = true;
      this.form = row;
    }

  }
};
</script>
