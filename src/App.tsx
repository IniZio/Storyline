import { defineComponent, ref } from 'vue'
import Title from './components/Title'

export default defineComponent({
  name: 'App',
  setup() {
    const title = ref('');
    const onInput = (e: any) => title.value = e.target.value
    
    return () =>
      <>
        <div class="container">
          <input onInput={onInput} value={title.value} />
          <Title title={title.value}/>
          Hello World
        </div>
      </>
  }
})
