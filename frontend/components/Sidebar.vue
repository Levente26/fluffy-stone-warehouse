<template>
  <div>
    <button v-if="!user">Signup</button>
    <button v-if="!user">Login</button>
    <button v-if="user" @click="handleLogout">Logout</button>
  </div>
</template>

<script setup>
const { logout } = useStrapiAuth();
const router = useRouter();
const localePath = useLocalePath();
const { locale } = useI18n();
const user = useStrapiUser();

const handleLogout = () => {
  logout();
  router.push(localePath("/login", locale.value));
};
</script>
