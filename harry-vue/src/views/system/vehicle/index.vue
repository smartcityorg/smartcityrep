<template>
  <div class="app-container">
    <!--所属项目/部门数据-->
  <!--  <el-col :span="4" :xs="24">
      <div class="head-container">
        <el-input
          v-model="deptName"
          placeholder="请输入所属项目"
          clearable
          size="small"
          prefix-icon="el-icon-search"
          style="margin-bottom: 20px"
        />
      </div>
      <div class="head-container">
        <el-tree
          :data="deptOptions"
          :props="defaultProps"
          :expand-on-click-node="false"
          :filter-node-method="filterNode"
          ref="tree"
          default-expand-all
          @node-click="handleNodeClick"
        />
      </div>
    </el-col> -->

    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="车牌号" prop="carNumber">
        <el-input
          v-model="queryParams.carNumber"
          placeholder="请输入车牌号"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>


      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="状态"
          clearable
          size="small"
          style="width: 240px"
        >
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

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:vehicle:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:vehicle:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:vehicle:remove']"
        >删除</el-button>
      </el-col>

    </el-row>

    <el-table v-loading="loading" :data="vehicleList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" align="center" prop="id" />
      <el-table-column label="车牌号" align="center" prop="carNumber" :show-overflow-tooltip="true" />
      <!-- <el-table-column label="所属项目" align="center" prop="deptName" :show-overflow-tooltip="true" /> -->
      <!-- <el-table-column label="绑定人员" align="center" prop="userIds" :show-overflow-tooltip="true" /> -->
<el-table-column label="绑定人员" align="center" prop="userIds" :formatter="userTypeFormat" :show-overflow-tooltip="true" />
      <el-table-column label="来源" align="center" prop="sourceType" :formatter="sourceTypeFormat" />
      <el-table-column label="品牌" align="center" prop="brand" :show-overflow-tooltip="true" />
      <el-table-column label="车型" align="center" prop="motorcycleType" :show-overflow-tooltip="true" />
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <el-switch
                  v-model="scope.row.status"
                  active-value="1"
                  inactive-value="0"
                  @change="handleStatusChange(scope.row)"
          />
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" >
        <template slot-scope="scope">
          <el-button
                  size="mini"
                  circle type="success"
                  icon="el-icon-edit"
                  @click="handleUpdate(scope.row)"
                  v-hasPermi="['system:vehicle:edit']"
          />
          <el-button
                  size="mini"
                  circle type="danger"
                  icon="el-icon-delete"
                  @click="handleDelete(scope.row)"
                  v-hasPermi="['system:vehicle:remove']"
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

    <!-- 添加或修改车辆信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="650px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
           <el-form-item label="车牌号" prop="carNumber">
             <el-input v-model="form.carNumber" placeholder="请输入车牌号"  />
           </el-form-item>
           </el-col>
           <el-col :span="1.5">
           <!-- <el-form-item label="所属项目" prop="deptId">
             <treeselect v-model="form.deptId" :options="deptOptions" placeholder="请选择所属项目"  @select="selectDepart" />
           </el-form-item> -->
         </el-col>
        </el-row>
       <el-row :gutter="10" class="mb8">
        <el-col :span="12" >
          <el-form-item label="绑定设备">
            <el-select v-model="form.deviceIds" multiple placeholder="请选择">
              <el-option
                      v-for="item in deviceOptions"
                      :key="item.id"
                      :label="item.deviceName"
                      :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        </el-row>
        <el-row :gutter="10" class="mb8">
         <el-col :span="12">
           <el-form-item label="绑定人员">
             <el-select v-model="form.userIds" multiple placeholder="请选择">
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
            <el-form-item label="车型" prop="motorcycleType">
              <el-input v-model="form.motorcycleType" placeholder="车型"  />
            </el-form-item>
            </el-col>
            <el-col :span="1.5">
            <el-form-item label="总重量" prop="totalWeight">
              <el-input v-model="form.totalWeight" placeholder="总重量"  />
            </el-form-item>
          </el-col>
         </el-row>
         <el-row :gutter="10" class="mb8">
             <el-col :span="1.5">
            <el-form-item label="车架号" prop="vinNo">
              <el-input v-model="form.vinNo" placeholder="车架号"  />
            </el-form-item>
            </el-col>
            <el-col :span="1.5">
            <el-form-item label="发动机号" prop="engineNo">
              <el-input v-model="form.engineNo" placeholder="发动机号"  />
            </el-form-item>
          </el-col>
         </el-row>
         <el-row :gutter="10" class="mb8">
             <el-col :span="1.5">
            <el-form-item label="品牌" prop="brand">
              <el-input v-model="form.brand" placeholder="品牌"  />
            </el-form-item>
            </el-col>
            <el-col :span="1.5">
            <!-- <el-form-item label="生产日期：">{{ parseTime(form.productionDate) }}</el-form-item> -->
            <el-form-item label="生产日期">
              <el-date-picker
                      v-model="form.productionDate"
                      size="small"
                      style="width: 240px"
                      value-format="yyyy-MM-dd HH:mm:ss"
              />
            </el-form-item>
          </el-col>
         </el-row>
         <el-row :gutter="10" class="mb8">
             <el-col :span="1.5">
            <el-form-item label="来源" prop="sourceType">
             <el-select v-model="form.sourceType" placeholder="来源" clearable >
               <el-option
                 v-for="dict in sourceTypeOptions"
                 :key="dict.dictValue"
                 :label="dict.dictLabel"
                 :value="dict.dictValue"
               />
             </el-select>
            </el-form-item>
            </el-col>
            <el-col :span="1.5">
            <el-form-item label="动力类型" prop="powerType">
             <el-select v-model="form.powerType" placeholder="动力类型" clearable >
               <el-option
                 v-for="dict in powerTypeOptions"
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
            <el-form-item label="保险公司" prop="insuranceCompany">
              <el-input v-model="form.insuranceCompany" placeholder="保险公司"  />
            </el-form-item>
            </el-col>
            <el-col :span="1.5">
            <!-- <el-form-item label="保险到期时间：">{{ parseTime(form.insuranceEndDate) }}</el-form-item>-->
             <el-form-item label="保险到期时间">
               <el-date-picker
                       v-model="form.insuranceEndDate"
                       size="small"
                       style="width: 240px"
                       value-format="yyyy-MM-dd HH:mm:ss"
               />
             </el-form-item>
          </el-col>
         </el-row>
         <el-row :gutter="10" class="mb8">
             <el-col :span="1.5">
            <el-form-item label="价值" prop="cost">
              <el-input v-model="form.cost" placeholder="价值"  />
            </el-form-item>
            </el-col>
            <el-col :span="1.5">
            <el-form-item label="所有权" prop="ownership">
              <el-input v-model="form.ownership" placeholder="所有权"  />
            </el-form-item>
          </el-col>
         </el-row>
         <!-- <el-row :gutter="10" class="mb8">
         <el-col :span="12">
            <el-form-item label="状态">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in statusOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
                >{{dict.dictLabel}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listVehicle, getVehicle, addVehicle, updateVehicle, delVehicle,exportVehicle,changeVehicleStatus } from "@/api/system/vehicle";
import { listAllDevice } from "@/api/system/device";
import { listAllUser } from "@/api/system/user";
import { treeselect } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

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
      vehicleList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 状态数据字典
      statusOptions: [],
      // 所属项目选项
      deptOptions: undefined,
      // 来源
      sourceTypeOptions: [],
      // 动力类型
      powerTypeOptions: [],
      deviceOptions: [],
      userOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        carNumber: undefined,
        status: undefined,
        deptId: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        carNumber: [
          { required: true, message: "车牌号不能为空", trigger: "blur" }
        ],
        // deptId: [
        //   { required: true, message: "所属项目不能为空", trigger: "blur" }
        // ],
        deviceIds: [
          { required: true, message: "绑定设备不能为空", trigger: "blur" }
        ],
        userIds: [
          { required: true, message: "绑定人员不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "状态不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("vehicle_status").then(response => {
      this.statusOptions = response.data;
    });
    this.getDicts("source_type").then(response => {
      this.sourceTypeOptions = response.data;
    });
    this.getDicts("power_type").then(response => {
      this.powerTypeOptions = response.data;
    });
    this.listAllDevice();
    this.listAllUser();
  },
  methods: {
    /** 查询质量标准列表 */
    getList() {
      this.loading = true;
      listVehicle(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
          this.vehicleList = response.data.list;
          this.total = response.data.total;
          this.loading = false;
        }
      );
    },
    // 车辆状态修改
    handleStatusChange(row) {
      let text = row.status === "1" ? "启用" : "停用";
      this.$confirm('确认要"' + text + '""' +"'车牌号为'"+ row.carNumber + '"车辆吗?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return changeVehicleStatus(row.id, row.status);
        }).then(() => {
          this.msgSuccess(text + "成功");
        }).catch(function() {
          row.status = row.status === "0" ? "1" : "0";
        });
    },
    // 字典车辆状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    sourceTypeFormat(row, column) {
      return this.selectDictLabel(this.sourceTypeOptions, row.sourceType);
    },
    userTypeFormat(row,column){
            let actions = [];
            Object.keys(this.userOptions).map((key) => {
                let userIds = row.userIds;
                if (userIds) {
                    userIds.forEach(value => {
                        if (this.userOptions[key].id == ('' + value)) {
                            actions.push(this.userOptions[key].username)
                        }
                    })
                }
            })
            return actions.join(',')
     },
    powerFormat(row, column) {
      return this.selectDictLabel(this.powerTypeOptions, row.powerType);
    },
    /** 查询部门下拉树结构 */
    getTreeselect() {
      treeselect().then(response => {
        this.deptOptions = response.data;
      });
    },
    listAllDevice(){
      listAllDevice().then(response => {
        this.deviceOptions = response.data;
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
        carNumber:undefined,
        // deptId: undefined,
        deviceIds: [],
        userIds: [],
        motorcycleType:undefined,
        totalWeight:undefined,
        vinNo:undefined,
        engineNo:undefined,
        brand:undefined,
        productionDate:undefined,
        sourceType:undefined,
        powerType:undefined,
        insuranceCompany:undefined,
        insuranceEndDate:undefined,
        cost:undefined,
        ownership:undefined,
        status: "1"
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
      this.title = "添加车辆信息";
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
      getVehicle(id).then(response => {
        this.form = response.data;
        this.form.sourceType = response.data.sourceType;
        this.form.powerType = response.data.powerType;
        this.form.userIds = response.data.userIds;
        this.form.deviceIds = response.data.deviceIds;
        this.open = true;
        this.title = "修改车辆信息";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateVehicle(this.form.id, this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.message);
              }
            });
          } else {
            addVehicle(this.form).then(response => {
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
      this.$confirm('是否确认删除车辆信息编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delVehicle(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有车辆信息数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportVehicle(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    },
    // 获取当前选中部门的名称
    selectDepart(val) {
      this.form.deptName = val.label
    }
  }
};
</script>
