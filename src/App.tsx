import { theme } from 'styled-tools';
import { defineComponent, ref } from 'vue'
import styled, {ThemeProvider} from 'vue3-styled-components'
import Playground from './components/Timer.vue';

import Title from './components/Title'

 
// Create a <StyledTitle> Vue component that renders an <h1> which is
// centered, palevioletred and sized at 1.5em
const StyledTitle = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: palevioletred;
  background-color: ${theme('primary')};
`;


export default defineComponent({
  name: 'App',
  setup(props, context) {
    const title = ref('');
    const onInput = (e: any) => title.value = e?.target?.value
    
    return () =>
      <ThemeProvider theme={{ primary: 'green' }}>
        <div class="container">
          <StyledTitle>Styled Title</StyledTitle>
          <Playground />
          <input onInput={onInput} value={title.value} />
          <Title class="Tomato" title={title.value}/>
          Hello World
        </div>
      </ThemeProvider>
  }
})

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
  .then(function(registration) {
    console.log('Registration successful, scope is:', registration.scope);
  })
  .catch(function(error) {
    console.log('Service worker registration failed, error:', error);
  });
}
