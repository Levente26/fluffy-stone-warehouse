<template>
  <form @submit.prevent="onSubmit">
    <label>{{ $t("auth.username") }}</label>
    <input
      class="mb-4 border-black border"
      type="text"
      v-model="username"
      @focusout="checkUsername"
      :class="{ 'form-field-error': usernameError }"
    />
    <div v-if="usernameError" class="form-error">{{ $t("auth.usernameError") }}</div>

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
    <div v-if="passwordError" class="form-error">{{ $t("auth.password") }}</div>

    <label>{{ $t("auth.passwordTwice") }}</label>
    <input
      class="mb-4 border-black border"
      type="password"
      v-model="passwordTwice"
      @focusout="checkPasswordTwice"
      :class="{ 'form-field-error': passwordTwiceError }"
    />
    <div v-if="passwordTwiceError" class="form-error">{{ $t("auth.passwordTwiceError") }}</div>

    <label>{{ $t("auth.phone") }}</label>
    <input
      class="mb-4 border-black border"
      type="number"
      v-model="phoneNumber"
      @focusout="checkPhone"
      :class="{ 'form-field-error': phoneError }"
    />
    <div v-if="phoneError" class="form-error">{{ $t("auth.phoneError") }}</div>

    <div v-if="serverError" class="form-error">{{ $t("auth.serverError") }}</div>

    <button>{{ $t("auth.signupBtn") }}</button>
  </form>

  <div class="signup__login-instead">
    <p>{{ $t("auth.loginInstead") }}</p>
    <nuxt-link :to="localePath('/login', locale)">{{ $t("auth.loginBtn") }}</nuxt-link>
  </div>
</template>

<script setup>
const { register } = useStrapiAuth();
const localePath = useLocalePath();
const { locale } = useI18n();
const router = useRouter();

const username = ref("");
const email = ref("");
const password = ref("");
const passwordTwice = ref("");
const phoneNumber = ref("");

const usernameError = ref(false);
const emailError = ref(false);
const passwordError = ref(false);
const passwordTwiceError = ref(false);
const phoneError = ref(false);
const serverError = ref(false);

const checkUsername = () => {
  if (!username.value || username.value.length === 0) {
    usernameError.value = true;
  } else {
    usernameError.value = false;
  }
};

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

const checkPasswordTwice = () => {
  if (password.value !== passwordTwice.value || !passwordTwice.value) {
    passwordTwiceError.value = true;
  } else {
    passwordTwiceError.value = false;
  }
};

const checkPhone = () => {
  if (!phoneNumber.value || phoneNumber.value.length === 0) {
    phoneError.value = true;
  } else {
    phoneError.value = false;
  }
};

const onSubmit = async () => {
  checkUsername();
  checkEmail();
  checkPassword();
  checkPasswordTwice();
  checkPhone();
  serverError.value = false;

  if (
    usernameError.value ||
    emailError.value ||
    passwordError.value ||
    passwordTwiceError.value ||
    phoneError.value
  )
    return;

  try {
    await register({
      username: username.value,
      email: email.value,
      password: password.value,
      phoneNumber: phoneNumber.value,
    });

    router.push(localePath("/", locale.value));
  } catch (e) {
    serverError.value = true;
  }
};
</script>

<style scoped lang="scss">
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

.signup__login-instead {
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
