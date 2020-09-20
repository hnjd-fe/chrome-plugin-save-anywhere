<template>
  <el-drawer
    :before-close="handleClose"
    :visible.sync="dialog"
    direction="rtl"
    custom-class="edit-drawer"
    ref="drawer"
    :show-close="frompage=='popup'"
  >
    <el-row slot="title" class="dtitle">
      <el-col :span="22">{{$t('editTask')}}</el-col>
      <el-col :span="2" style="text-align: center; white-space: nowrap">
        <el-link type="danger" @click="onDelete()" v-if="frompage!='popup'">{{$t('delete')}}</el-link>
      </el-col>
    </el-row>
    <el-row class="demo-drawer__content">
      <el-col>
        <el-form :model="form" @submit.native.prevent :label-width="formLabelWidth">
          <el-form-item :label="$t('note')">
            <el-input
              autocomplete="off"
              v-focus
              v-model="form.note"
              :placeholder="$t('inputPlaceholder')"
              type="textarea"
              suffix-icon="el-icon-enter"
              autosize
              @keydown.ctrl.enter.native="onSubmit()"
            ></el-input>
          </el-form-item>

          <el-form-item :label="$t('title')">
            <el-input
              autocomplete="off"
              v-focus
              v-model="form.siteTitle"
              :placeholder="$t('inputPlaceholder')"
              type="textarea"
              suffix-icon="el-icon-enter"
              autosize
              @keydown.ctrl.enter.native="onSubmit()"
            ></el-input>
          </el-form-item>

          <el-form-item :label="$t('url')">
            <el-input
              autocomplete="off"
              v-focus
              v-model="form.siteUrl"
              :placeholder="$t('inputPlaceholder')"
              type="textarea"
              suffix-icon="el-icon-enter"
              autosize
              @keydown.ctrl.enter.native="onSubmit()"
            ></el-input>
          </el-form-item>

          <el-form-item>
            <el-radio-group v-model="form.status" size="medium">
              <el-radio-button
                v-for="(sitem, sindex) in typemap.status"
                :label="sitem.value"
                :key="sindex"
              >{{$t(`status-${sitem.value?1:0}`)}}</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <div class="demo-drawer__footer" :style="{marginLeft: formLabelWidth}">
          <el-button type="primary" @click="onSubmit()">{{$t('submit')}}</el-button>
          <el-button @click="onClose()">{{$t('cancel')}}</el-button>
        </div>
      </el-col>
    </el-row>
  </el-drawer>
</template>

<style>
.dtitle {
  font-size: 14px;
}

.el-drawer__header {
  margin-bottom: 0px;
}

.demo-drawer__content {
  padding: 20px;
  padding-top: 15px;
}

.el-form-item {
  margin-bottom: 0px;
}

.demo-drawer__footer {
  margin-top: 15px;
}

.el-drawer__body {
  overflow-y: auto;
}
</style>

<script>
import modifyMixin from "@src/mixin/modify.js";

export default {
  mixins: [modifyMixin],
  props: ["index", "item", "close", "update", "isedit", 'frompage'],
  watch: {
    isedit: function(newv, oldv) {
      this.dialog = !!newv;
      if (newv) {
        newv.status = newv.status ? true : false;
        this.form = this.clone(newv);
      } else {
        this.form = {};
      }
    }
  },
  data() {
    return {
      table: false,
      dialog: false,
      loading: false,
      form: {},
      formLabelWidth: "80px"
    };
  },
  methods: {
    updateTotal() {},
    handleClose(done) {
      this.onClose();
    },
    onDateChange() {
      console.log("onDateChange", this.daterange);
      this.form.startDate = this.daterange[0].getTime();
      this.form.endDate = this.daterange[1].getTime();
    },
    onDelete() {
      this.$confirm(this.$t("deleteConfirm"), {
        confirmButtonText: this.$t("confirm"),
        cancelButtonText: this.$t("cancel")
      }).then(
        () => {
          console.log("onDelete", Date.now());

          this.deleteItem(this.form.id, this.form.md5, this.form).then(() => {
            this.onClose();
            this.update && this.update();
          });
        },
        () => {}
      );
    },
    onSubmit() {
      console.log("onSubmit", this.form.note, Date.now());
      if (!this.form.note) {
        this.$message({
          message: this.$t("requireNote"),
          type: "warning"
        });
        return;
      }

      if (this.form.status) {
        this.form.endDate = this.moment()._d.getTime();
      }

      this.updateItem(this.form.id, this.form).then(json => {
        console.log("edit update", this.form.id, this.form);
        this.onClose();
        this.update && this.update();
      });

      return false;
    },
    onClose(evt, json) {
      this.close && this.close(this.index, this.item, json);
    }
  },
  mounted() {
    this.updateTotal();
  },
  computed: {},
  directives: {
    focus: {
      inserted: function(el) {
        el.querySelector("textarea").focus();
      }
    }
  }
};
</script>
