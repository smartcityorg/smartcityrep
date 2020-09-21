<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">

     <el-form-item label="标题" prop="title">
       <el-input
         v-model="queryParams.title"
         placeholder="请输入标题"
         clearable
         size="small"
         style="width: 240px"
         @keyup.enter.native="handleQuery"
       />
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
          v-hasPermi="['system:patrol:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:patrol:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:patrol:remove']"
        >删除</el-button>
      </el-col>

    </el-row>

    <el-table v-loading="loading" :data="patrolList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" align="center" prop="id" />
      <el-table-column label="标题" align="center" prop="title" :show-overflow-tooltip="true" />
      <el-table-column label="开始时间" align="center" prop="startDate" :show-overflow-tooltip="true" />
      <el-table-column label="结束时间" align="center" prop="endDate" :show-overflow-tooltip="true" />
      <el-table-column label="巡查员" align="center" prop="username" :show-overflow-tooltip="true" />
      <el-table-column label="巡查内容" align="center" prop="patrolContent" :show-overflow-tooltip="true" />
      <el-table-column label="操作" align="center" >
        <template slot-scope="scope">
          <el-button
                  size="mini"
                  circle type="success"
                  icon="el-icon-edit"
                  @click="handleUpdate(scope.row)"
                  v-hasPermi="['system:patrol:edit']"
          />
          <el-button
                  size="mini"
                  circle type="danger"
                  icon="el-icon-delete"
                  @click="handleDelete(scope.row)"
                  v-hasPermi="['system:patrol:remove']"
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
           <el-form-item label="标题" prop="title">
             <el-input v-model="form.title" placeholder="请输入标题"  />
           </el-form-item>
           </el-col>
         </el-row>
        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
              <el-form-item label="排班日期">
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

         <el-col :span="12">
           <el-form-item label="巡查区域" prop="areaId">
             <treeselect v-model="form.areaId" :options="areaOptions" placeholder="请选择巡查区域"  @select="selectArea" />
           </el-form-item>
         </el-col>

         <el-col :span="1.5">
       <el-form-item label="巡查员" prop="userId">
          <el-select v-model="form.userId"  placeholder="请选择">
            <el-option
                    v-for="item1 in userOptions"
                    :key="item1.id"
                    :label="item1.username"
                    :value="item1.id"
            />
          </el-select>
        </el-form-item>
        </el-col>
     </el-row>


    <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
       <el-form-item label="巡查内容" prop="patrolContent">
         <el-input v-model="form.patrolContent" type="textarea" placeholder="请输入巡查内容"  />
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
import { listPatrol, getPatrol, addPatrol, updatePatrol, delPatrol, exportPatrol} from "@/api/sanitation/patrol";
import { listAllUser } from "@/api/system/user";
import { treeselect } from "@/api/system/area";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "Patrol",
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
      patrolList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 区域树选项
      areaOptions: undefined,
      // 区域名称
      areaName: undefined,
      // 巡查员
      userOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        title: undefined,
        startDate:undefined,
        endDate:undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        title: [
          { required: true, message: "标题不能为空", trigger: "blur" }
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
        areaId: [
          { required: true, message: "巡查区域不能为空", trigger: "blur" }
        ],
        patrolContent: [
          { required: true, message: "巡查内容不能为空", trigger: "blur" }
        ]
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
    this.listAllUser();
    this.getTreeselect();


  },
  methods: {
    /** 查询巡查排班列表 */
    getList() {
      this.loading = true;
      listPatrol(this.addDateRange(this.queryParams, this.dateRange)).then(response => {

          this.patrolList = response.data.list;
          this.total = response.data.total;
          this.loading = false;
        }
      );
    },
    listAllUser(){
      listAllUser().then(response => {
        this.userOptions = response.data;
      });
    },
    /** 查询区域下拉树结构 */
    getTreeselect() {
      treeselect().then(response => {
        this.areaOptions = response.data;
      });
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
        title: undefined,
        areaId: undefined,
        userId: undefined,
        username: undefined,
        patrolContent: undefined
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
      this.getTreeselect();
      this.open = true;
      this.title = "添加巡查排班信息";
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
      this.getTreeselect();
      const id = row.id || this.ids
      getPatrol(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改作业任务信息";
        const userId=row.userId;
        this.form.userId=0;
        this.userOptions.map((item)=>{
          if(item.id===userId){
            this.form.userId=item.id;
          }
        });

      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            updatePatrol(this.form.id, this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.message);
              }
            });
          } else {
            addPatrol(this.form).then(response => {
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
      this.$confirm('是否确认删除巡查排班序号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delPatrol(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有巡查排班数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportPatrol(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    },
    // 获取当前选中负责人的名称
    selectUser(val) {
      alert(val.label);
      this.form.username = val.label
    },
    // 获取当前选中区域的名称
    selectArea(val) {
      this.form.areaName = val.label
    }
  }
};
</script>
