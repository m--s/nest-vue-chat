import { mount } from '@vue/test-utils';
import ChatMessage from '@/components/chat/ChatMessage.vue';
import Vuetify from 'vuetify'
import Vue from "vue";

describe('ChatMessage', () => {
  beforeEach(() => {
    Vue.use(Vuetify);
  });

  it('renders with left orientation', () => {
    const wrapper = mount(ChatMessage, {
      propsData: {name: 'Marcin', text: 'Lorem ipsum', orientation: 'left'}
    });

    expect(wrapper.find('.message-bubble--right').exists()).toBe(false);
    expect(wrapper.find('.message-bubble--left').exists()).toBe(true);
  });

  it('renders with right orientation', () => {
    const wrapper = mount(ChatMessage, {
      propsData: {name: 'Marcin', text: 'Lorem ipsum', orientation: 'right'}
    });

    expect(wrapper.find('.message-bubble--right').exists()).toBe(true);
    expect(wrapper.find('.message-bubble--left').exists()).toBe(false);
  });
});
