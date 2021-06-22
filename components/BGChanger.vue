<template>
  <div v-click-outside="close">
    <div
      class="bg-changer-icon"
      :class="{ 'bg-changer-active': active }"
      @click="toggle"
    >
      <GearIcon fill="currentColor" />
    </div>
    <div class="themes" :class="{ 'bg-changer-active': active }">
      <ul>
        <li class="background-1" @click="changeBg(1)"></li>
        <li class="background-2" @click="changeBg(2)"></li>
        <li class="background-3" @click="changeBg(3)"></li>
        <li class="background-4" @click="changeBg(4)"></li>
        <li class="background-5" @click="changeBg(5)"></li>
        <li class="background-6" @click="changeBg(6)"></li>
        <li class="background-7" @click="changeBg(7)"></li>
        <li class="background-8" @click="changeBg(8)"></li>
        <li class="background-9" @click="changeBg(9)"></li>
        <li class="background-10" @click="changeBg(10)"></li>
        <li class="background-11" @click="changeBg(11)"></li>
        <li class="background-12" @click="changeBg(12)"></li>
        <li class="background-13" @click="changeBg(13)"></li>
        <li class="background-14" @click="changeBg(14)"></li>
        <li class="background-15" @click="changeBg(15)"></li>
        <li class="background-16" @click="changeBg(16)"></li>
        <li class="background-17" @click="changeBg(17)"></li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import GearIcon from './icons/gear.vue';

export default Vue.extend({
  components: {
    GearIcon,
  },
  data() {
    return {
      active: false,
    };
  },
  mounted() {
    const theme = localStorage.getItem('themeColor');

    if (theme) {
      this.changeBg(+theme);
    }
  },
  methods: {
    toggle() {
      this.active = !this.active;
    },
    close() {
      this.active = false;
    },
    changeBg(style: number) {
      document.querySelector('body')!.classList.value = `background-${style}`;

      // save theme to localStorage
      localStorage.setItem('themeColor', style.toString());
    },
  },
});
</script>

<style lang="scss" scoped>
.bg-changer-active {
  transform: translateX(-230px);
}

.bg-changer-icon {
  position: fixed;
  top: 40vh;
  right: 0;
  width: 3.5rem;
  height: 3.5rem;
  padding: 0.6rem;
  color: var(--clr-neutral-100);
  background: var(--clr-neutral-700);
  border-radius: 5px 0 0 5px;
  z-index: 1000;
  transition: all 0.3s;
  cursor: pointer;
}

.themes {
  position: fixed;
  top: 0;
  left: 100%;
  height: 100vh;
  background: #000;
  z-index: 1000;
  transition: all 0.3s;
  overflow-y: auto;
  scrollbar-width: thin;
}

ul {
  display: grid;
  grid-template-columns: auto auto;
  list-style: none;
  padding: 2rem;

  &:last-child {
    padding-bottom: 0;
  }

  li {
    width: 85px;
    height: 75px;
    margin: 0 20px 20px 0px;
    border-radius: 5px;
    cursor: pointer;

    &:nth-child(even) {
      margin-right: 0;
    }
  }
}
</style>

<style lang="scss">
.background-1 {
  background: linear-gradient(
    to bottom right,
    var(--clr-primary-200),
    var(--clr-primary-300)
  );
}

.background-2 {
  background: linear-gradient(45deg, #0c675e, #069e90);
}

.background-3 {
  background: linear-gradient(
    143deg,
    rgba(165, 42, 4, 0.89),
    rgba(113, 102, 8, 0.89),
    rgba(13, 95, 16, 0.93),
    rgba(4, 79, 88, 0.94),
    rgba(19, 56, 86, 0.9),
    rgba(24, 32, 78, 0.94),
    rgba(100, 8, 115, 0.95)
  );
}

.background-4 {
  background: linear-gradient(-37deg, teal, purple, orange);
}

.background-5 {
  background: linear-gradient(45deg, #29323c, #485563);
}

.background-6 {
  background: linear-gradient(45deg, #795548, #945c48);
}

.background-7 {
  background: linear-gradient(45deg, #65379b, #886aea);
}

.background-8 {
  background: linear-gradient(180deg, #ff5447, #f1076f);
}

.background-9 {
  background: linear-gradient(180deg, #08a50e, #69bb03);
}

.background-10 {
  background: linear-gradient(45deg, #6a11cb, #2575fc);
}

.background-11 {
  background: url(../assets/images/bg_images/1.png);
  background-size: cover;
  background-position: center;
}

.background-12 {
  background: url(../assets/images/bg_images/2.png);
  background-size: cover;
  background-position: center;
}

.background-13 {
  background: url(../assets/images/bg_images/3.png);
  background-size: cover;
  background-position: center;
}

.background-14 {
  background: url(../assets/images/bg_images/4.png);
  background-size: cover;
  background-position: center;
}

.background-15 {
  background: url(../assets/images/bg_images/5.png);
  background-size: cover;
  background-position: center;
}

.background-16 {
  background: url(../assets/images/bg_images/6.png);
  background-size: cover;
  background-position: center;
}

.background-17 {
  background: url(../assets/images/bg_images/7.jpg);
  background-size: cover;
  background-position: center;
}
</style>
