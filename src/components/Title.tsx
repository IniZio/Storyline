import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Title',
  props: {
    title: {
      type: String,
      require: false,
      default: 'This is title.'
    }
  },
  setup(props) {
    return () =>
      <>
        <h1 class="title">
          { props.title }
          <button class="button is-primary">Hello</button>
        </h1>
      </>
  }
})
