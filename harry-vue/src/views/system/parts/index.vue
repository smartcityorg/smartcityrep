<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">

      <el-form-item label="部件名称" prop="partsName">
        <el-input
          v-model="queryParams.partsName"
          placeholder="请输入部件名称"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="部件类型" prop="partstypeId">
         <el-select v-model="queryParams.partstypeId"  placeholder="部件类型"
         clearable
         size="small"
         style="width: 240px"
         >
           <el-option
                   v-for="item2 in partstypeOptions"
                   :key="item2.id"
                   :label="item2.typeName"
                   :value="item2.id"
           />
         </el-select>
       </el-form-item>


      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="部件状态"
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
          v-hasPermi="['system:parts:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:parts:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:parts:remove']"
        >删除</el-button>
      </el-col>

    </el-row>

    <el-table v-loading="loading" :data="partsList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" align="center" prop="id" />
      <el-table-column label="部件名称" align="center" prop="partsName" :show-overflow-tooltip="true" />
      <el-table-column label="部件类型" align="center" prop="partstypeName" :show-overflow-tooltip="true" />
      <el-table-column label="负责人" align="center" prop="username" :show-overflow-tooltip="true" />
      <!-- <el-table-column label="位置区域" align="center" prop="" :show-overflow-tooltip="true" /> -->
      <!-- <el-table-column label="绑定设备" align="center" prop="deviceIds" :show-overflow-tooltip="true" /> -->
     <el-table-column label="绑定设备" align="center" prop="deviceIds" :formatter="deviceTypeFormat" :show-overflow-tooltip="true" />

      <el-table-column label="部件类别" align="center" prop="partsCategory" :formatter="partsCategoryFormat" />

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
                  v-hasPermi="['system:parts:edit']"
          />
          <el-button
                  size="mini"
                  circle type="danger"
                  icon="el-icon-delete"
                  @click="handleDelete(scope.row)"
                  v-hasPermi="['system:parts:remove']"
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
        <el-form-item label="部件名称" prop="partsName">
          <el-input v-model="form.partsName" placeholder="请输入部件名称"  />
        </el-form-item>
        </el-col>
        <el-col :span="1.5">
        <el-form-item label="负责人" prop="userId">
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
        <el-form-item label="部件类别" prop="partsCategory">
         <el-select v-model="form.partsCategory" placeholder="部件类别" clearable >
           <el-option
             v-for="dict in partsCategoryOptions"
             :key="dict.dictValue"
             :label="dict.dictLabel"
             :value="dict.dictValue"
           />
         </el-select>
        </el-form-item>
        </el-col>
       <!-- <el-col :span="1.5">
        <el-form-item label="上级部件" prop="pid">
         <el-select v-model="form.pid" placeholder="上级部件" clearable >
           <el-option
             v-for="dict in pidOptions"
             :key="dict.dictValue"
             :label="dict.dictLabel"
             :value="dict.dictValue"
           />
         </el-select>
        </el-form-item>
      </el-col> -->
     </el-row>
      <el-row :gutter="10" class="mb8">
         <el-col :span="1.5">
        <el-form-item label="面积" prop="area">
          <el-input v-model="form.area" placeholder="请输入面积" />
        </el-form-item>
        </el-col>
        <el-col :span="1.5">
        <el-form-item label="长度" prop="plength">
          <el-input v-model="form.plength" placeholder="请输入长度" />
        </el-form-item>
        </el-col>
        </el-row>
        <el-row :gutter="10" class="mb8">
           <el-col :span="1.5">
        <el-form-item label="地图标注" prop="">
          <el-button @click="">点击标注</el-button>
        </el-form-item>
        </el-col>
        <el-col :span="1.5">
        <el-form-item label="半径" prop="radius">
          <el-input v-model="form.radius" placeholder="请输入半径" />
        </el-form-item>
        </el-col>
        </el-row>
        <el-row :gutter="10" class="mb8">
           <el-col :span="1.5">
        <el-form-item label="部件地址" prop="partsAddress">
          <el-input v-model="form.partsAddress" placeholder="请输入部件地址" />
        </el-form-item>
        </el-col>
        </el-row>
        <el-row :gutter="10" class="mb8">
           <el-col :span="12">
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
          <el-form-item label="部件类型" prop="partstypeId">
             <el-select v-model="form.partstypeId"  placeholder="请选择">
               <el-option
                       v-for="item2 in partstypeOptions"
                       :key="item2.id"
                       :label="item2.typeName"
                       :value="item2.id"
               />
             </el-select>
           </el-form-item>

       </el-col>
       <el-col :span="1.5">
        <el-form-item label="所有权" prop="ownership">
         <el-input v-model="form.ownership" placeholder="请输入所有权"  />
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
import { listParts, getParts, addParts, updateParts, delParts, exportParts,changePartsStatus } from "@/api/system/parts";
import { listAllDevice } from "@/api/system/device";
import { listAllUser } from "@/api/system/user";
import { listAllPartstype } from "@/api/system/partstype";

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
      partsList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 状态数据字典
      statusOptions: [],
      // 设备选项
      deviceOptions: [],
      // 部件类别
      partsCategoryOptions: [],
      // 负责人
      userOptions: [],
      // 部件类型
      partstypeOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        partsName: undefined,
        partstypeName: undefined,
        status: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        partsName: [
          { required: true, message: "部件名称不能为空", trigger: "blur" }
        ],
        userId: [
          { required: true, message: "负责人不能为空", trigger: "blur" }
        ],
        partsCategory: [
          { required: true, message: "部件类别不能为空", trigger: "blur" }
        ],
        area: [
          { required: true, message: "面积不能为空", trigger: "blur" }
        ],
        plength: [
          { required: true, message: "长度不能为空", trigger: "blur" }
        ],
        partsAddress: [
          { required: true, message: "部件地址不能为空", trigger: "blur" }
        ],
        partstypeId: [
          { required: true, message: "部件类型不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("quality_status").then(response => {
      this.statusOptions = response.data;
    });
    this.getDicts("parts_category").then(response => {
      this.partsCategoryOptions = response.data;
    });
    this.listAllDevice();
    this.listAllUser();
    this.listAllPartstype();

  },
  methods: {
    /** 查询设备列表 */
    getList() {
      this.loading = true;
      listParts(this.addDateRange(this.queryParams, this.dateRange)).then(response => {

          this.partsList = response.data.list;
          this.total = response.data.total;
          this.loading = false;
        }
      );
    },
    // 字典设备状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    partsCategoryFormat(row, column) {
      return this.selectDictLabel(this.partsCategoryOptions, row.partsCategory);
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
    listAllPartstype(){
      listAllPartstype().then(response => {
        this.partstypeOptions = response.data;
      });
    },
    deviceTypeFormat(row,column){
            let actions = [];
            Object.keys(this.deviceOptions).map((key) => {
                let deviceIds = row.deviceIds;
                if (deviceIds) {
                    deviceIds.forEach(value => {
                        if (this.deviceOptions[key].id == ('' + value)) {
                            actions.push(this.deviceOptions[key].deviceName)
                        }
                    })
                }
            })
            return actions.join(',')
     },
    // 部件状态修改
    handleStatusChange(row) {
      let text = row.status === "1" ? "启用" : "停用";
      this.$confirm('确认要"' + text + '""' + row.partsName + '"部件吗?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return changePartsStatus(row.id, row.status);
        }).then(() => {
          this.msgSuccess(text + "成功");
        }).catch(function() {
          row.status = row.status === "0" ? "1" : "0";
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
        partsName: undefined,
        userId: undefined,
        username: undefined,
        partsCategory: undefined,
        pid: undefined,
        area: undefined,
        plength: undefined,
        radius: undefined,
        partsAddress: undefined,
        source: undefined,
        worth: undefined,
        partstypeId: undefined,
        partstypeName: undefined,
        status: "1",
        ownership: undefined
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
      this.title = "添加部件信息";
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
      getParts(id).then(response => {
        this.form = response.data;
        this.form.partsCategory = response.data.partsCategory;
        this.open = true;
        this.title = "修改部件信息";

        const userId=row.userId;
        // this.form.userIds=[];
        // this.form.username="";
        this.form.userId=0;
        this.userOptions.map((item1)=>{
          if(item1.id===userId){
            // this.form.userIds.push(item1.id);
            // this.form.username=item1.username;
            this.form.userId=item1.id;
            // this.form.username=item1.username;
            // this.form.userIds.push(userId);
          }
        });
        this.partstypeOptions.map((item2)=>{
          if(item2.id===partstypeId){
            this.form.partstypeId=item2.id;
          }
        });
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateParts(this.form.id, this.form).then(response => {
              // let username = "";
              // this.userOptions.map((item1) => {
              //         if(this.form.userId === item1.id) {
              //              username = item1.username;
              //              alert(username);
              //     }
              // });
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.message);
              }
            });
          } else {
            addParts(this.form).then(response => {
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
      this.$confirm('是否确认删除部件编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delParts(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有部件数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportParts(queryParams);
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
