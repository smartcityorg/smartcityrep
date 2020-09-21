<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">

      <el-form-item label="任务名称" prop="taskName">
       <el-select v-model="queryParams.taskName" placeholder="任务名称" clearable >
         <el-option
           v-for="dict in taskNameOptions"
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

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:cleaningtask:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:cleaningtask:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:cleaningtask:remove']"
        >删除</el-button>
      </el-col>

    </el-row>

    <el-table v-loading="loading" :data="cleaningtaskList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" align="center" prop="id" />
      <el-table-column label="任务名称" align="center" prop="taskName" :formatter="taskNameFormat" />
      <el-table-column label="任务类型" align="center" prop="taskType" :formatter="taskTypeFormat" />
      <el-table-column label="开始时间" align="center" prop="startDate" :show-overflow-tooltip="true" />
      <el-table-column label="结束时间" align="center" prop="endDate" :show-overflow-tooltip="true" />

      <el-table-column label="操作" align="center" >
        <template slot-scope="scope">
          <el-button
                  size="mini"
                  circle type="success"
                  icon="el-icon-edit"
                  @click="handleUpdate(scope.row)"
                  v-hasPermi="['system:cleaningtask:edit']"
          />
          <el-button
                  size="mini"
                  circle type="danger"
                  icon="el-icon-delete"
                  @click="handleDelete(scope.row)"
                  v-hasPermi="['system:cleaningtask:remove']"
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

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="650px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
           <el-form-item label="任务名称" prop="taskName">
            <el-select v-model="form.taskName" placeholder="任务名称" clearable >
              <el-option
                v-for="dict in taskNameOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
           </el-form-item>
           </el-col>
         </el-row>
          <el-row :gutter="10" class="mb8">
           <el-col :span="1.5">
           <el-form-item label="任务类型" prop="taskType">
             <el-radio-group v-model="form.taskType">
               <el-radio
                 v-for="dict in taskTypeOptions"
                 :key="dict.dictValue"
                 :label="dict.dictValue"
               >{{dict.dictLabel}}</el-radio>
             </el-radio-group>
           </el-form-item>
         </el-col>
        </el-row>
        <el-row :gutter="10" class="mb8">
         <el-col :span="1.5">
           <el-form-item label="时间">
             <el-date-picker
                     v-model="form.startDate"
                     size="small"
                     style="width: 140px"
                     value-format="yyyy-MM-dd"
                     start-placeholder="开始时间"
             />
               <!-- type="daterange" -->
           </el-form-item>
           至
           <el-form-item>
             <el-date-picker
                     v-model="form.endDate"
                     size="small"
                     style="width: 140px"
                     value-format="yyyy-MM-dd"
                     end-placeholder="结束时间"
             />
           </el-form-item>


     </el-col>
     </el-row>
       <el-row :gutter="10" class="mb8">
         <el-col :span="1.5">
        <el-form-item label="作业部件">
          <el-select v-model="form.partsIds" multiple placeholder="请选择">
            <el-option
                    v-for="item in partsOptions"
                    :key="item.id"
                    :label="item.partsName"
                    :value="item.id"
            />
          </el-select>
        </el-form-item>
        </el-col>
     </el-row>


    <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
       <el-form-item label="作业内容" prop="taskContent">
         <el-input v-model="form.taskContent" type="textarea" placeholder="请输入作业内容"  />
       </el-form-item>
       </el-col>
    </el-row>


      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listCleaningTask, getCleaningTask, addCleaningTask, updateCleaningTask, delCleaningTask, exportCleaningTask} from "@/api/sanitation/cleaningtask";
import { listAllParts } from "@/api/system/parts";

export default {
  name: "Cleaningtask",
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
      // 字典表格数据
      cleaningtaskList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      //状态
      statusOptions: [],
      // 任务名称
      taskNameOptions: [],
      // 任务类型
      taskTypeOptions: [],
      //作业部件
      partsOptions:[],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        taskName: undefined,
        startDate:undefined,
        endDate:undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        taskName: [
          { required: true, message: "任务名称不能为空", trigger: "blur" }
        ],
        // taskType: [
        //   { required: true, message: "任务类型不能为空", trigger: "blur" }
        // ],
        startDate: [
          { required: true, message: "排班开始时间不能为空", trigger: "blur" }
        ],
        endDate: [
          { required: true, message: "排班结束时间不能为空", trigger: "blur" }
        ],
        partsIds: [
          { required: true, message: "作业部件不能为空", trigger: "blur" }
        ],
        taskContent: [
          { required: true, message: "作业内容不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
    this.listAllParts();
    this.getDicts("task_name").then(response => {
      this.taskNameOptions = response.data;
    });
    this.getDicts("task_type").then(response => {
      this.taskTypeOptions = response.data;
    });

  },
  methods: {
    /** 查询保洁时段列表 */
    getList() {
      this.loading = true;
      listCleaningTask(this.addDateRange(this.queryParams, this.dateRange)).then(response => {

          this.cleaningtaskList = response.data.list;
          this.total = response.data.total;
          this.loading = false;
        }
      );
    },
    listAllParts(){
      listAllParts().then(response => {
        this.partsOptions = response.data;
      });
    },
    taskNameFormat(row, column) {
      return this.selectDictLabel(this.taskNameOptions, row.taskName);
    },
    taskTypeFormat(row, column) {
      return this.selectDictLabel(this.taskTypeOptions, row.taskType);
    },

    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        startDate: undefined,
        endDate: undefined,
        taskName: undefined,
        taskType: "1",
        partsIds: undefined,
        taskContent: undefined
      };
      this.resetForm("form");
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
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加作业任务信息";
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getCleaningTask(id).then(response => {
        this.form = response.data;
        this.form.taskName = response.data.taskName;
        this.open = true;
        this.title = "修改作业任务信息";

      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateCleaningTask(this.form.id, this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.message);
              }
            });
          } else {
            addCleaningTask(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.message);
              }
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除作业任务序号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delCleaningTask(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有作业任务数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportCleaningTask(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    },
    // 获取当前选中负责人的名称
    selectUser(val) {
      alert(val.label);
      this.form.username = val.label
    }
  }
};
</script>
