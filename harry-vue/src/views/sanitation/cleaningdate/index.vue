<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">

      <el-form-item label="作业人员" prop="userId">
         <el-select v-model="queryParams.userId"  placeholder="作业人员"
         clearable
         size="small"
         style="width: 240px"
         >
           <el-option
                   v-for="item in userOptions"
                   :key="item.id"
                   :label="item.username"
                   :value="item.id"
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
          v-hasPermi="['system:cleaningdate:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:cleaningdate:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:cleaningdate:remove']"
        >删除</el-button>
      </el-col>

    </el-row>

    <el-table v-loading="loading" :data="cleaningdateList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" align="center" prop="id" />
      <el-table-column label="开始时间" align="center" prop="startDate" :show-overflow-tooltip="true" />
      <el-table-column label="结束时间" align="center" prop="endDate" :show-overflow-tooltip="true" />
      <el-table-column label="作业人员" align="center" prop="username" :show-overflow-tooltip="true" />
      <el-table-column label="作业车辆" align="center" prop="carNumber" :show-overflow-tooltip="true" />

      <el-table-column label="操作" align="center" >
        <template slot-scope="scope">
          <el-button
                  size="mini"
                  circle type="success"
                  icon="el-icon-edit"
                  @click="handleUpdate(scope.row)"
                  v-hasPermi="['system:cleaningdate:edit']"
          />
          <el-button
                  size="mini"
                  circle type="danger"
                  icon="el-icon-delete"
                  @click="handleDelete(scope.row)"
                  v-hasPermi="['system:cleaningdate:remove']"
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
           <el-form-item label="时间">
             <el-time-picker
                     v-model="form.startDate"
                     size="small"
                     style="width: 140px"
                     value-format="HH:mm"
                     type="daterange"
                     start-placeholder="开始时间"
             />
           </el-form-item> 至
           <el-form-item>
             <el-time-picker
                     v-model="form.endDate"
                     size="small"
                     style="width: 140px"
                     value-format="HH:mm"
                     type="daterange"
                     end-placeholder="结束时间"
             />
           </el-form-item>


     </el-col>
     </el-row>
       <el-row :gutter="10" class="mb8">
         <el-col :span="1.5">
        <el-form-item label="作业人员" prop="userId">
           <el-select v-model="form.userId"  placeholder="请选择">
             <el-option
                     v-for="item in userOptions"
                     :key="item.id"
                     :label="item.username"
                     :value="item.id"
             />
           </el-select>
         </el-form-item>
        </el-col>
     </el-row>

    <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
       <el-form-item label="作业车辆" prop="vehicleId">
          <el-select v-model="form.vehicleId"  placeholder="请选择">
            <el-option
                    v-for="item1 in vehicleOptions"
                    :key="item1.id"
                    :label="item1.carNumber"
                    :value="item1.id"
            />
          </el-select>
        </el-form-item>
       </el-col>
    </el-row>
    <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
       <el-form-item label="频次" prop="frequency">
         <el-input v-model="form.frequency" placeholder="请输入频次"  />
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
import { listCleaningDate, getCleaningDate, addCleaningDate, updateCleaningDate, delCleaningDate, exportCleaningDate} from "@/api/sanitation/cleaningdate";
import { listAllVehicle } from "@/api/system/vehicle";
import { listAllUser } from "@/api/system/user";

export default {
  name: "Dict",
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
      cleaningdateList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 作业人员
      userOptions: [],
      // 作业车辆
      vehicleOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userId: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        startDate: [
          { required: true, message: "开始时间不能为空", trigger: "blur" }
        ],
        endDate: [
          { required: true, message: "结束时间不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
    this.listAllVehicle();
    this.listAllUser();

  },
  methods: {
    /** 查询保洁时段列表 */
    getList() {
      this.loading = true;
      listCleaningDate(this.addDateRange(this.queryParams, this.dateRange)).then(response => {

          this.cleaningdateList = response.data.list;
          this.total = response.data.total;
          this.loading = false;
        }
      );
    },
    listAllVehicle(){
      listAllVehicle().then(response => {
        this.vehicleOptions = response.data;
      });
    },
    listAllUser(){
      listAllUser().then(response => {
        this.userOptions = response.data;
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
        userId: undefined,
        username: undefined,
        vehicleId: undefined,
        carNumber: undefined,
        frequency:undefined
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
      this.title = "添加保洁时段信息";
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
      getCleaningDate(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改保洁时段信息";

        const userId=row.userId;
        this.form.userId=0;
        this.userOptions.map((item)=>{
          if(item.id===userId){
            this.form.userId=item.id;
          }
        });

        const vehicleId=row.vehicleId;
        this.form.vehicleId=0;
        this.vehicleOptions.map((item1)=>{
          if(item1.id===vehicleId){
            this.form.vehicleId=item1.id;
          }
        });

      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateCleaningDate(this.form.id, this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.message);
              }
            });
          } else {
            addCleaningDate(this.form).then(response => {
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
      this.$confirm('是否确认删除保洁时段序号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delCleaningDate(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有保洁时段数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportCleaningDate(queryParams);
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
