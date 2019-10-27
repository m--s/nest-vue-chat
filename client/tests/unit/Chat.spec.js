import {shallowMount} from '@vue/test-utils';
import Chat from '@/components/chat/Chat.vue';
import Vuetify from 'vuetify'
import Vue from "vue";

describe('Chat', () => {
  let wrapper;

  const mocks = {
    $socket: {
      client: {
        id: '123',
        emit: () => jest.fn(),
      }
    }
  };

  beforeEach(() => {
    Vue.use(Vuetify);

    wrapper = shallowMount(Chat, {
      propsData: {
        name: 'Marcin', recipientName: 'Host', userType: 'client'
      },
      mocks,
    });
  });

  it('Gets right orientation', () => {
    expect(wrapper.vm.getMessageOrientation({fromId: '123'})).toBe('right');
    expect(wrapper.vm.getMessageOrientation({fromId: '456'})).toBe('left');
  });

  it('Renders message in right window - no recipientId', () => {
    expect(wrapper.vm.shouldRenderMessage({fromId: '123', to: '1'})).toBe(true);
  });

  it('Renders message in right window - with recipientId', () => {
    const wrapper2 = shallowMount(Chat, {
      propsData: {
        name: 'Marcin', recipientName: 'Host', userType: 'client', recipientId: '456'
      },
      mocks,
    });
    expect(wrapper2.vm.shouldRenderMessage({fromId: '123', to: '1'})).toBe(false);
  });

});
