<template>
  <div class="mission-manage">
    <el-row>
      <el-col :span="24">
        <el-card class="box-card">
          <div class="search">
            <el-input
              v-model="searchVal"
              placeholder="搜索任务名称"
              class="search-input margin-box"
              @keyup.native.enter="search"
            ></el-input>
            <el-select
              v-model="selectType"
              placeholder="状态"
              class="select-input margin-box"
              @change="search"
              clearable
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-button icon="el-icon-search" class="margin-box" @click="search" circle></el-button>
            <el-button
              type="success"
              icon="el-icon-refresh"
              class="margin-box"
              @click="refresh"
              circle
              title="重置"
            ></el-button>
            <el-button
              icon="el-icon-plus"
              type="primary"
              class="margin-box"
              title="添加定时任务"
              @click="addItem"
              circle
            ></el-button>
            <el-button
              icon="el-icon-document-copy"
              type="warning"
              class="margin-box"
              title="查看执行日志"
              @click="showLogList"
              circle
            ></el-button>
          </div>
          <el-table :max-height="$store.state.tableHeight.tableHeight" :data="missionList" style="width: 100%" highlight-current-row stripe border>
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-form label-position="left" inline class="demo-table-expand">
                  <el-form-item label="执行方法" class="expand-line">
                    <span>{{ props.row.methodName }}</span>
                  </el-form-item>
                  <el-form-item label="执行参数" class="expand-line">
                    <span>{{ props.row.params }}</span>
                  </el-form-item>
                  <el-form-item label="cron表达式" class="expand-line">
                    <span>{{ props.row.cronExpression }}</span>
                  </el-form-item>
                  <el-form-item label="描述" class="expand-line">
                    <span>{{ props.row.remark }}</span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column label="任务名称" show-overflow-tooltip>
              <template slot-scope="scope">
                <div slot="reference" class="name-wrapper">{{ scope.row.jobName }}</div>
              </template>
            </el-table-column>
            <el-table-column label="Bean名称" show-overflow-tooltip>
              <template slot-scope="scope">
                <div slot="reference">{{ scope.row.beanName }}</div>
              </template>
            </el-table-column>
            <el-table-column label="状态" align="center">
              <template slot-scope="scope">
                <div slot="reference">
                  <el-tag :type="scope.row.paused ? 'info' : 'success'">
                    {{ scope.row.paused
                    ? '已暂停'
                    : '运行中' }}
                  </el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="更新日期" width="180">
              <template slot-scope="scope">
                <div slot="reference" class="name-wrapper">{{ scope.row.createdAt }}</div>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200" fixed="right" align="center">
              <template slot-scope="scope">
                <el-button type="text" @click="editItem(scope.row)">编辑</el-button>
                <el-button type="text" @click="executeItem(scope.row)">执行</el-button>
                <el-button
                  type="text"
                  @click="recoverItem(scope.row)"
                >{{ scope.row.paused ? '恢复' : '暂停'}}</el-button>
                <el-button type="text" @click="deleteItem(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <pagination
            ref="pagination"
            :get-data="getMissionList"
            :now-page.sync="nowPage"
            :now-size.sync="nowSize"
            :total="totalElements"
          />
        </el-card>
      </el-col>
    </el-row>
    <Form ref="form" :is-add="isAdd" />
    <Table ref="table" />
  </div>
</template>

<script>
import Initial from "./js/initial";
import Operation from "./js/operation";
import Property from "./js/property";
import Form from "./components/form";
import Table from "./components/table";
export default {
  mixins: [Initial, Operation, Property],
  components: { Form, Table }
};
</script>

<style lang="scss" scoped>
</style>
