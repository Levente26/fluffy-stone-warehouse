<template>
  <form @submit.prevent="onSubmit">
    username
    <input
      class="mb-4 border-black border"
      type="text"
      v-model="username"
      @focusout="checkUsername"
    />
    <div v-if="usernameError" class="form-error">error happened</div>

    email
    <input
      class="mb-4 border-black border"
      type="email"
      v-model="email"
      @focusout="checkEmail"
    />
    <div v-if="emailError" class="form-error">error happened</div>
    
    password
    <input
      class="mb-4 border-black border"
      type="password"
      v-model="password"
      @focusout="checkPassword"
    />
    <div v-if="passwordError" class="form-error">error happened</div>

    
    password twice
    <input
      class="mb-4 border-black border"
      type="password"
      v-model="passwordTwice"
      @focusout="checkPasswordTwice"
    />
    <div v-if="passwordTwiceError" class="form-error">error happened</div>

    
    phone
    <input
      class="mb-4 border-black border"
      type="number"
      v-model="phoneNumber"
      @focusout="checkPhone"
    />
    <div v-if="phoneError" class="form-error">error happened</div>

    <div v-if="serverError" class="form-error">server error happened</div>

    <button>submit</button>
  </form>

  already have an account? log in!
  <nuxt-link :to="localePath('/login', locale)">log in</nuxt-link>
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
  if (password.value !== passwordTwice.value) {
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
