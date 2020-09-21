<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">

      <el-form-item label="设备类型" prop="deviceType">
       <el-select
         v-model="queryParams.deviceType"
         placeholder="设备类型"
         clearable
         size="small"
         style="width: 240px"
       >
         <el-option
           v-for="dict in deviceTypeOptions"
           :key="dict.dictValue"
           :label="dict.dictLabel"
           :value="dict.dictValue"
         />
       </el-select>
      </el-form-item>

      <el-form-item label="绑定类型" prop="bindType">
       <el-select
         v-model="queryParams.bindType"
         placeholder="绑定类型"
         clearable
         size="small"
         style="width: 240px"
       >
         <el-option
           v-for="dict in bindTypeOptions"
           :key="dict.dictValue"
           :label="dict.dictLabel"
           :value="dict.dictValue"
         />
       </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="设备状态"
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
          v-hasPermi="['system:device:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:device:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:device:remove']"
        >删除</el-button>
      </el-col>

    </el-row>

    <el-table v-loading="loading" :data="deviceList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" align="center" prop="id" />
      <el-table-column label="设备名称" align="center" prop="deviceName" :show-overflow-tooltip="true" />
      <el-table-column label="设备ID" align="center" prop="deviceNo" :show-overflow-tooltip="true" />
     <el-table-column label="状态" align="center" prop="status" :formatter="statusFormat" />
     <el-table-column label="设备类型" align="center" prop="deviceType" :formatter="deviceTypeFormat" />
     <el-table-column label="绑定类型" align="center" prop="bindType" :formatter="bindTypeFormat" />


      <el-table-column label="操作" align="center" >
        <template slot-scope="scope">
          <el-button
                  size="mini"
                  circle type="success"
                  icon="el-icon-edit"
                  @click="handleUpdate(scope.row)"
                  v-hasPermi="['system:device:edit']"
          />
          <el-button
                  size="mini"
                  circle type="danger"
                  icon="el-icon-delete"
                  @click="handleDelete(scope.row)"
                  v-hasPermi="['system:device:remove']"
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
        <el-form-item label="设备名称" prop="deviceName">
          <el-input v-model="form.deviceName" placeholder="请输入设备名称"  />
        </el-form-item>
        </el-col>
        <el-col :span="1.5">
        <el-form-item label="设备号" prop="deviceNo">
          <el-input v-model="form.deviceNo" placeholder="请输入设备号" :disabled="disabledInput"/>
        </el-form-item>
     </el-col>
     </el-row>
       <el-row :gutter="10" class="mb8">
         <el-col :span="1.5">
        <el-form-item label="设备类型" prop="deviceType">
         <el-select v-model="form.deviceType" placeholder="设备类型" clearable >
           <el-option
             v-for="dict in deviceTypeOptions"
             :key="dict.dictValue"
             :label="dict.dictLabel"
             :value="dict.dictValue"
           />
         </el-select>
        </el-form-item>
        </el-col>
        <el-col :span="1.5">
        <el-form-item label="绑定类型" prop="bindType">
         <el-select v-model="form.bindType" placeholder="绑定类型" clearable >
           <el-option
             v-for="dict in bindTypeOptions"
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
        <el-form-item label="资产号" prop="assetnumber">
          <el-input v-model="form.assetnumber" placeholder="请输入资产号" />
        </el-form-item>
        </el-col>
        <el-col :span="1.5">
        <el-form-item label="厂家" prop="factory">
          <el-input v-model="form.factory" placeholder="请输入厂家" />
        </el-form-item>
        </el-col>
        </el-row>
        <el-row :gutter="10" class="mb8">
           <el-col :span="1.5">
        <el-form-item label="型号" prop="modelnumber">
          <el-input v-model="form.modelnumber" placeholder="请输入型号" />
        </el-form-item>
        </el-col>
        <el-col :span="1.5">
        <el-form-item label="设备位置" prop="devicelocation">
          <el-input v-model="form.devicelocation" placeholder="请输入设备位置" />
        </el-form-item>
        </el-col>
        </el-row>
        <el-row :gutter="10" class="mb8">
           <el-col :span="1.5">
        <el-form-item label="维护人" prop="maintainer">
          <el-input v-model="form.maintainer" placeholder="请输入维护人" />
        </el-form-item>
        </el-col>
        <el-col :span="1.5">
        <el-form-item label="维护电话" prop="maintainercall">
          <el-input v-model="form.maintainercall" placeholder="请输入维护电话" />
        </el-form-item>
        </el-col>
        </el-row>
        <el-row :gutter="10" class="mb8">
           <el-col :span="1.5">
        <el-form-item label="来源" prop="source">
          <el-input v-model="form.source" placeholder="请输入来源" />
        </el-form-item>
        </el-col>
        <el-col :span="1.5">
        <el-form-item label="价值(元)" prop="worth">
          <el-input v-model="form.worth" placeholder="请输入价值(单位：元)" />
        </el-form-item>
        </el-col>
        </el-row>
        <el-row :gutter="10" class="mb8">
           <el-col :span="1.5">
        <el-form-item label="所有权" prop="ownership">
          <el-input v-model="form.ownership" placeholder="请输入所有权" />
        </el-form-item>
        </el-col>
        <el-col :span="1.5">
        <el-form-item label="所在坐标" prop="coordinates">
          <el-input v-model="form.coordinates" placeholder="请输入所在坐标" />
        </el-form-item>
         </el-col>
        </el-row>


        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="用途" prop="deviceUse">
          <el-input v-model="form.deviceUse" type="textarea" placeholder="请输入内容"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listDevice, getDevice, delDevice, addDevice, updateDevice, exportDevice } from "@/api/system/device";

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
      deviceList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 状态数据字典
      statusOptions: [],
      // 设备类型
      deviceTypeOptions: [],
      // 绑定类型
      bindTypeOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: undefined,
        deviceType: undefined,
        bindType: undefined,
        status: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        deviceNo: [
          { required: true, message: "设备号不能为空", trigger: "blur" }
        ],
        deviceName: [
          { required: true, message: "设备名称不能为空", trigger: "blur" }
        ],
        deviceType: [
          { required: true, message: "设备类型不能为空", trigger: "blur" }
        ],
        bindType: [
          { required: true, message: "绑定类型不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("device_status").then(response => {
      this.statusOptions = response.data;
    });
    this.getDicts("devide_type").then(response => {
      this.deviceTypeOptions = response.data;
    });
    this.getDicts("device_bind_type").then(response => {
      this.bindTypeOptions = response.data;
    });
  },
  methods: {
    /** 查询设备列表 */
    getList() {
      this.loading = true;
      listDevice(this.addDateRange(this.queryParams, this.dateRange)).then(response => {

          this.deviceList = response.data.list;
          this.total = response.data.total;
          this.loading = false;
        }
      );
    },
    // 字典设备状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    deviceTypeFormat(row, column) {
      return this.selectDictLabel(this.deviceTypeOptions, row.deviceType);
    },
    bindTypeFormat(row, column) {
      return this.selectDictLabel(this.bindTypeOptions, row.bindType);
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
        deviceNo: undefined,
        deviceName: undefined,
        deviceType: undefined,
        bindType: undefined,
        status: "0",
        remark: undefined
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
      this.title = "添加设备信息";
      this.disabledInput=false;
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
      getDevice(id).then(response => {
        this.form = response.data;
        this.form.deviceType = response.data.deviceType;
        this.form.bindType = response.data.bindType;
        this.open = true;
        this.title = "修改设备信息";
        this.disabledInput=true;
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateDevice(this.form.id, this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.message);
              }
            });
          } else {
            addDevice(this.form).then(response => {
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
      this.$confirm('是否确认删除设备编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delDevice(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有类型数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportDevice(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
