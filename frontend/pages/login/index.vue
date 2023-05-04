<template>
  <form @submit.prevent="onSubmit">
    email
    <input
      class="mb-4 border-black border"
      type="email"
      v-model="email"
      @focusout="checkEmail"
    />
    <div v-if="emailError">error happened</div>

    password
    <input
      class="mb-4 border-black border"
      type="password"
      v-model="password"
      @focusout="checkPassword"
    />
    <div v-if="passwordError">error happened</div>

    <div v-if="serverError">server error happened</div>

    <button :disabled="emailError || passwordError">submit</button>
  </form>
  dont have an account? sign up now!
  <nuxt-link :to="localePath('/signup', locale)">sign up</nuxt-link>
</template>

<script setup>
const { login } = useStrapiAuth();
const localePath = useLocalePath();
const { locale } = useI18n();
const router = useRouter();

const email = ref("");
const password = ref("");
const emailError = ref(false);
const passwordError = ref(false);
const serverError = ref(false);

const checkEmail = () => {
  if (!email.value.match(/[^\s@]+@[^\s@]+\.[^\s@]+/gi)) {
    emailError.value = true;
  } else {
    emailError.value = false;
  }
};

const checkPassword = () => {
  if (!password.value || password.value.length === 0) {
    passwordError.value = true;
  } else {
    passwordError.value = false;
  }
};

const onSubmit = async () => {
  serverError.value = false;
  try {
    await login({ identifier: email.value, password: password.value });
    router.push(localePath("/", locale.value));
  } catch (e) {
    serverError.value = true;
  }
};
</script>
