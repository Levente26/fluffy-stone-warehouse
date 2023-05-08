<template>
  <form @submit.prevent="onSubmit">
    <label>{{ $t("auth.email") }}</label>
    <input
      class="mb-4 border-black border"
      type="email"
      v-model="email"
      @focusout="checkEmail"
      :class="{ 'form-field-error': emailError }"
    />
    <div v-if="emailError" class="form-error">{{ $t("auth.emailError") }}</div>

    <label>{{ $t("auth.password") }}</label>
    <input
      class="mb-4 border-black border"
      type="password"
      v-model="password"
      @focusout="checkPassword"
      :class="{ 'form-field-error': passwordError }"
    />
    <div v-if="passwordError" class="form-error">
      {{ $t("auth.passwordError") }}
    </div>

    <div v-if="serverError" class="form-error">{{ $t("serverError") }}</div>

    <button :disabled="emailError || passwordError">
      {{ $t("auth.loginBtn") }}
    </button>
  </form>

  <div class="login__signup-instead">
    <p>{{ $t("auth.signupInstead") }}</p>
    <nuxt-link :to="localePath('/signup', locale)">{{
      $t("auth.signupBtn")
    }}</nuxt-link>
  </div>
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
  checkEmail();
  checkPassword();
  serverError.value = false;

  if (emailError.value || passwordError.value) return;

  try {
    await login({ identifier: email.value, password: password.value });
    router.push(localePath("/", locale.value));
  } catch (e) {
    serverError.value = true;
  }
};
</script>

<style lang="scss" scoped>
form {
  @apply flex flex-col max-w-lg mx-auto w-full mt-20 px-4;

  & > label {
    @apply text-sm font-montserratLight;
    @apply mb-1;
  }

  & > input,
  select {
    @apply w-full mb-4 py-2 px-4 border border-gray-300 bg-white rounded-md font-montserratLight;
  }

  & > button {
    @apply w-max mx-auto my-4 py-2 px-6 cursor-pointer;
    @apply border border-font bg-font text-white rounded-md;
    @apply transition-all duration-300;

    &:hover {
      @apply bg-white text-font;
    }
  }
}

.login__signup-instead {
  @apply flex flex-col items-center mt-6 px-4;

  & > p {
    @apply font-montserratLight;
  }

  & > a {
    @apply font-montserratMedium;
    @apply text-font;
    @apply transition-all duration-300;

    &:hover {
      @apply underline;
    }
  }
}
</style>
