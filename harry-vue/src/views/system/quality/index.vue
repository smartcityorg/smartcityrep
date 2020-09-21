<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">

      <el-form-item label="质量类型" prop="qualityType">
       <el-select
         v-model="queryParams.qualityType"
         placeholder="质量类型"
         clearable
         size="small"
         style="width: 240px"
       >
         <el-option
           v-for="dict in qualityTypeOptions"
           :key="dict.dictValue"
           :label="dict.dictLabel"
           :value="dict.dictValue"
         />
       </el-select>
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
          v-hasPermi="['system:quality:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:quality:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:quality:remove']"
        >删除</el-button>
      </el-col>

    </el-row>

    <el-table v-loading="loading" :data="qualityList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" align="center" prop="id" />
      <el-table-column label="质量内容" align="center" prop="qualityContent" :show-overflow-tooltip="true" />
      <el-table-column label="质量类型" align="center" prop="qualityType" :formatter="qualityTypeFormat" />
      <el-table-column label="所属板块" align="center" prop="plateType" :formatter="plateTypeFormat" />
      <el-table-column label="扣分" align="center" prop="deductPoints" :show-overflow-tooltip="true" />
      <el-table-column label="处理时限(分钟)" align="center" prop="processLimited" :show-overflow-tooltip="true" />
      <el-table-column label="说明" align="center" prop="remark" :show-overflow-tooltip="true" />
      <!-- <el-table-column label="状态" align="center" prop="status" :formatter="statusFormat" /> -->
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
           <el-form-item label="质量类型" prop="qualityType">
            <el-select v-model="form.qualityType" placeholder="质量类型" clearable >
              <el-option
                v-for="dict in qualityTypeOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
           </el-form-item>
           </el-col>
           <el-col :span="1.5">
           <el-form-item label="所属板块" prop="plateType">
            <el-select v-model="form.plateType" placeholder="所属板块" clearable >
              <el-option
                v-for="dict in plateTypeOptions"
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
        <el-form-item label="扣分" prop="deductPoints">
          <el-input v-model="form.deductPoints" placeholder="请输入扣分"  />
        </el-form-item>
        </el-col>
        <el-col :span="1.5">
        <el-form-item label="处理时限" prop="processLimited">
          <el-input v-model="form.processLimited" placeholder="请输入处理时限(分钟)"  />
        </el-form-item>
     </el-col>
     </el-row>
        <el-form-item label="质量内容" prop="qualityContent">
          <el-input v-model="form.qualityContent" type="textarea" placeholder="请输入质量内容"/>
        </el-form-item>
        <el-form-item label="说明" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入说明"/>
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
import { listQuality, getQuality, delQuality, addQuality, updateQuality,changeQualityStatus,exportQuality } from "@/api/system/quality";

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
      qualityList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 状态数据字典
      statusOptions: [],
      // 质量类型
      qualityTypeOptions: [],
      // 所属板块
      plateTypeOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        qualityType: undefined,
        status: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        qualityType: [
          { required: true, message: "质量类型不能为空", trigger: "blur" }
        ],
        plateType: [
          { required: true, message: "所属板块不能为空", trigger: "blur" }
        ],
        deductPoints: [
          { required: true, message: "扣分不能为空", trigger: "blur" }
        ],
        processLimited: [
          { required: true, message: "处理时限不能为空", trigger: "blur" }
        ],
        qualityContent: [
          { required: true, message: "质量内容不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("quality_status").then(response => {
      this.statusOptions = response.data;
    });
    this.getDicts("quality_type").then(response => {
      this.qualityTypeOptions = response.data;
    });
    this.getDicts("plate_type").then(response => {
      this.plateTypeOptions = response.data;
    });
  },
  methods: {
    /** 查询质量标准列表 */
    getList() {
      this.loading = true;
      listQuality(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
          this.qualityList = response.data.list;
          this.total = response.data.total;
          this.loading = false;
        }
      );
    },
    // 质量标准状态修改
    handleStatusChange(row) {
      let text = row.status === "1" ? "启用" : "停用";
      this.$confirm('确认要"' + text + '""' +"'序号为'"+ row.id + '"质量标准吗?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return changeQualityStatus(row.id, row.status);
        }).then(() => {
          this.msgSuccess(text + "成功");
        }).catch(function() {
          row.status = row.status === "0" ? "1" : "0";
        });
    },
    // 字典质量标准状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    qualityTypeFormat(row, column) {
      return this.selectDictLabel(this.qualityTypeOptions, row.qualityType);
    },
    plateTypeFormat(row, column) {
      return this.selectDictLabel(this.plateTypeOptions, row.plateType);
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
        deductPoints: undefined,
        processLimited: undefined,
        qualityType: undefined,
        plateType: undefined,
        qualityContent:undefined,
        status: "1",
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
      this.title = "添加质量标准";
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
      getQuality(id).then(response => {
        this.form = response.data;
        this.form.qualityType = response.data.qualityType;
        this.form.plateType = response.data.plateType;
        this.open = true;
        this.title = "修改质量标准";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateQuality(this.form.id, this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.message);
              }
            });
          } else {
            addQuality(this.form).then(response => {
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
      this.$confirm('是否确认删除质量标准编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delQuality(ids);
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
          return exportQuality(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
