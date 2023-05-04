<template>
  <div>
    <button>Signup</button>
    <button>Login</button>
    <button @click="handleLogout">Logout</button>
  </div>
</template>

<script setup>
const { logout } = useStrapiAuth();
const router = useRouter();
const localePath = useLocalePath();
const { locale } = useI18n();

const handleLogout = () => {
  logout();
  router.push(localePath("/login", locale.value));
};
</script>
