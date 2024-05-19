<template>
    <div>
        <!--面包屑导航区域-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!--        卡片区域-->
        <el-card>
            <!--  添加按钮-->
            <el-row :gutter="20">
                <el-col :span="4">
                    <el-button type="primary" @click="openAddRole">添加角色</el-button>
                </el-col>
            </el-row>
            <!-- 角色列表-->
            <el-table v-loading="loading"
                      :data="roleList"
                      border
                      stripe>
                //展示权限
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <!--                       <pre> {{scope.row.children}}</pre>-->
                        <el-row :class="['bdbottom',i1===0? 'bdtop': '','vcenter']"
                                v-for="(item1,i1) in scope.row.children" :key="item1.id">
                            <!--渲染一级权限-->
                            <el-col :span="5">
                                <el-tag>{{item1.name}}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!--渲染二级权限-->
                            <el-col :span="19">
                                <el-row :class="[i2===0?'bdtop':'','vcenter']"
                                        v-for="(item2,i2) in item1.children" :key="item2.id">
                                    <el-col :span="6">
                                        <el-tag type="success">{{item2.name}}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="18">
                                        <el-tag type="warning" v-for="(item3,i3) in item2.children" :key="item3.id"
                                                closable @close="removeMenuById(scope.row.id,item3.id)">
                                            {{item3.name}}
                                        </el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>

                    </template>
                </el-table-column>
                <el-table-column label="#" type="index"></el-table-column>
                <el-table-column label="角色名称" prop="nameZh"></el-table-column>
                <el-table-column label="角色描述" prop="remark"></el-table-column>
                <el-table-column label="操作" width="300px">
                    <template slot-scope="scope">
                        <!--修改-->
                        <el-button type="primary" icon="el-icon-edit" size="mini"
                                   @click="openEditRole(scope.row)">修改
                        </el-button>
                        <!--删除-->
                        <el-button type="danger" icon="el-icon-delete" size="mini"
                                   @click="deleteRole(scope.row.id)">删除
                        </el-button>
                        <!--分配权限-->
                        <el-tooltip effect="dark" content="分配权限" placement="top" :enterable="false">
                            <el-button type="warning" icon="el-icon-setting" size="mini"
                                       @click="openAssPow(scope.row)">分配权限
                            </el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>

            </el-table>
            <!-- 添加对话框-->
            <el-dialog
                    title="添加角色"
                    :visible.sync="addRoleDialog"
                    width="40%"
                    @close="addDialogClosed">
                <!--内容主体区域-->
                <el-form :model="addRole" :rules="addRoleRules" ref="addRoleRef" label-width="90px">
                    <el-form-item label="英文名称" prop="name">
                        <el-input v-model="addRole.name"></el-input>
                    </el-form-item>
                    <el-form-item label="角色名称" prop="nameZh">
                        <el-input v-model="addRole.nameZh"></el-input>
                    </el-form-item>
                    <el-form-item label="角色描述" prop="remark">
                        <el-input v-model="addRole.remark"></el-input>
                    </el-form-item>
                </el-form>
                <!--内容底部区域-->
                <span slot="footer" class="dialog-footer">
                <el-button @click="addRoleDialog = false">取 消</el-button>
                <el-button type="primary" @click="addRoleYes">确 定</el-button>
                </span>

            </el-dialog>
            <!-- 修改对话框-->
            <el-dialog
                    title="修改用户"
                    :visible.sync="editRoleDialog"
                    width="50%">
                <el-form ref="editRoleRef" :model="editRole" :rules="addRoleRules" label-width="80px">
                    <el-form-item label="角色">
                        <el-input v-model="editRole.name" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="角色名称" prop="name">
                        <el-input v-model="editRole.nameZh"></el-input>
                    </el-form-item>
                    <el-form-item label="角色描述">
                        <el-input v-model="editRole.remark"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
               <el-button @click="editRoleDialog = false">取 消</el-button>
                <el-button type="primary" @click="editRoleYes">确 定</el-button>
                </span>

            </el-dialog>
            <!--分配权限对话框-->
            <el-drawer
                    title="分配权限"
                    :visible.sync="assPowDialog"
                    >
                <div class="demo-drawer__content">
                <el-tree
                        :data="menuTree"
                         :props="menuTreeProps"
                         show-checkbox
                         node-key="id"
                         default-expand-all
                         :default-checked-keys="defKes"
                         ref="treeRef">
                </el-tree>

                    <div  class="demo-drawer__footer">
                    <el-button style="position: absolute; right: 20px" @click="assPowDialog = false" >取 消</el-button>
                    <el-button style="position: absolute; right: 100px" type="primary" @click="assPowYes">确 定</el-button>
                    </div>
                </div>
<!--            </el-dialog>-->
            </el-drawer>
        </el-card>
    </div>
</template>

<script>
    import {MessageBox, Message} from 'element-ui'

    export default {
        name: "RoleList",
        data() {
            return {
                queryInfo:{
                    query:''
                },
                roleList: [],
                loading: false,
                //添加对话框
                addRoleDialog: false,
                //修改对话框
                editRoleDialog: false,
                //添加数据
                addRole: {
                    name: '',
                    nameZh: '',
                    remark: ''
                },
                addRoleRules: {
                    name: [{required: true, message: '请填写角色英文名称', trigger: 'blur'}],
                    nameZh: [{required: true, message: '请填写角色中文名称', trigger: 'blur'}],
                },
                editRole: {
                    id: 4,
                    name: '',
                    nameZh: '',
                    remark: ''
                },
                assPowDialog: false,
                menuTree: [],
                menuTreeProps: {
                    label: 'name',
                    children: 'children'
                },
                defKes: [],
                powData:{
                  roleId:'',
                  mids:''
                }
            }
        },
        methods: {

            async getRoleList() {
                this.loading = true;
                const res = await this.$http.get('/staff/roleList');
                for (let i = 0; i < res.obj.length; i++) {
                    res.obj[i].children = [];
                }
                for (let i = 0; i < res.obj.length; i++) {
                    res.obj[i].children = this.list_to_tree(res.obj[i].menus);
                }

                this.roleList = res.obj;
                this.loading = false
            },
            //打开编辑角色对话框
            openEditRole(roleInfo) {
                this.editRoleDialog = true;
                this.editRole = roleInfo;
            },
            deleteRole(roleId) {
                MessageBox.confirm('此操作将永久删除角色, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    const res =await this.$http.delete('/staff/deleteRole/' + roleId);
                    if (res){
                        this.getRoleList();
                    }
                }).catch(() => {
                    Message({
                        type: 'info',
                        message: '已取消删除'
                    });
                    return;
                });

            },
            addDialogClosed() {
                this.$refs.addRoleRef.resetFields();
            },
            //打开编辑角色对话框
            openAddRole() {
                this.addRoleDialog = true;
            },
            addRoleYes() {
                this.$refs.addRoleRef.validate(async valid => {
                    if (!valid) return;
                    const res = await this.$http.post('/staff/addRole', this.addRole);
                    if (res){
                        this.addRoleDialog = false;
                        this.getRoleList();
                    }
                })
            },
            editRoleYes() {
                this.$refs.editRoleRef.validate(async valid => {
                    if (!valid) return;
                    const res = await this.$http.put('/staff/editRole', this.editRole);
                    if (res){
                        this.editRoleDialog = false;
                        this.getRoleList();
                    }
                })
            },
            //打开分配权限对话框
            async openAssPow(menuInfo) {
                this.defKes = []
                this.powData.roleId = menuInfo.id;
                this.queryInfo.query = menuInfo.id;
                this.assPowDialog = true;
                const res = await this.$http.get('/staff/powList/',{params:this.queryInfo});
                if (!res) return;
                //获取到的数据
                this.menuTree = res.obj.all;
                this.defKes = res.obj.current;
            },
            getDdfKes(list) {
                const arr = [];
                for (let i = 0; i < list.length; i++) {
                    if (list[i].level === 2) {
                        arr.push(list[i].id);
                    }
                }
                return arr;
            },
            //根据id删除权限
            removeMenuById(rid,mid){
                MessageBox.confirm('删除后用户将不再享有该权限，是否删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    const res=await this.$http.delete('/staff/deletePow/'+rid+'/'+mid);
                    if (res){
                        this.getRoleList();
                    }
                }).catch(() => {
                    Message({
                        type: 'info',
                        message: '已取消删除'
                    });
                    return;
                });
            },
            //分配权限
            async assPowYes(){
                this.loading=true;
                const keys=[
                    ...this.$refs.treeRef.getCheckedKeys(),
                    ...this.$refs.treeRef.getHalfCheckedKeys()
                ]
                const keyStr=keys.join(',');
                this.powData.mids=keyStr;
                const res=await this.$http.post('/staff/assPow',this.powData);
                if (res){
                    this.assPowDialog=false;
                    this.loading=false;
                    this.getRoleList();
                }
            },
            //list列表转换成tree
            list_to_tree(list) {
                const map = [];
                const roots = [];
                for (let i = 0; i < list.length; i++) {
                    map[list[i].id] = i;
                    list[i].children = [];
                }
                for (let i = 0; i < list.length; i++) {
                    const node = list[i];
                    if (node.parentId === 1) {
                        roots.push(node);
                    }
                }
                return roots;
            }

        },
        created() {
            this.getRoleList();
        },

    }
</script>

<style lang="less" scoped>
    .el-tag {
        margin: 7px;
    }

    .bdtop {
        border-top: 1px solid #eee;
    }

    .bdbottom{
        border-bottom: 1px solid #eee;
    }

    .vcenter{
        display: flex;
        align-items: center;
    }
</style>
