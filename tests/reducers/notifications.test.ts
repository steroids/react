import {
    NOTIFICATIONS_CLOSE,
    NOTIFICATIONS_SHOW,
} from '../../src/actions/notifications';
import notifications, {
    TNotificationsState,
} from '../../src/reducers/notifications';

describe('notifications reducers', () => {
    const defaultInitialState: TNotificationsState = {
        items: [],
        position: '',
    };

    let initialState: TNotificationsState = {...defaultInitialState};

    beforeEach(() => {
        initialState = {...defaultInitialState};
    });

    it('NOTIFICATIONS_CLOSE', () => {
        const id = 'notification1';

        const items = [
            {
                id,
            },
        ];

        const action = {
            type: NOTIFICATIONS_CLOSE,
            id,
        };

        initialState.items = items;

        const expectedState = {
            ...initialState,
            items: [],
        };

        expect(notifications(initialState, action)).toEqual(expectedState);
    });

    it('NOTIFICATIONS_SHOW', () => {
        const action = {
            type: NOTIFICATIONS_SHOW,
            id: 'notification3',
            level: 'danger',
            message: 'This button starts snowing!',
            position: 'offsetLeft: 300px, offsetTop: 50%',
        };

        const items = [
            {
                id: 'notification52',
            },
        ];

        initialState.items = items;

        const expectedState = {
            ...initialState,
            items: [
                ...items,
                {
                    id: action.id,
                    level: action.level,
                    message: action.message,
                    isClosing: false,
                    position: action.position,
                },
            ],
            position: action.position,
        };

        expect(notifications(initialState, action)).toEqual(expectedState);
    });
});
