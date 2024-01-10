export default {
    'form.AutoCompleteFieldView': {
        lazy: () => require('./form/AutoCompleteField/AutoCompleteFieldMockView').default,
    },
    'form.FieldLayoutView': {
        lazy: () => require('./form/FieldLayout/FieldLayoutMockView').default,
    },
    'form.ButtonView': {
        lazy: () => require('./form/Button/ButtonMockView').default,
    },
    'form.FileFieldView': {
        lazy: () => require('./form/FileField/FileFieldMockView').default,
    },
    'content.DropDownView': {
        lazy: () => require('./content/DropDown/DropDownMockView').default,
    },
    'content.DashboardItemView': {
        lazy: () => require('./content/Dashboard/DashboardItemMockView').default,
    },
    'content.SliderView': {
        lazy: () => require('./content/Slider/SliderMockView').default,
    },
    'content.KanbanView': {
        lazy: () => require('./content/Kanban/mockViews/KanbanMockView').default,
    },
    'content.KanbanColumnView': {
        lazy: () => require('./content/Kanban/mockViews/KanbanColumnMockView').default,
    },
    'content.KanbanTaskView': {
        lazy: () => require('./content/Kanban/mockViews/KanbanTaskMockView').default,
    },
    'content.KanbanModalView': {
        lazy: () => require('./content/Kanban/mockViews/KanbanModal/KanbanModalMockView').default,
    },
    'content.CalendarSystemView': {
        lazy: () => require('./content/CalendarSystem/CalendarSystemMockView').default,
    },
    'content.CalendarSystemModalView': {
        lazy: () => require('./content/CalendarSystem/CalendarSystemModalMockView').default,
    },
    'content.CalendarSystemEventGroupModalView': {
        lazy: () => require('./content/CalendarSystem/CalendarSystemEventGroupModalMockView').default,
    },
    'content.ChatView': {
        lazy: () => require('./content/Chat/mockViews/ChatMockView').default,
    },
    'content.ChatInputView': {
        lazy: () => require('./content/Chat/mockViews/ChatInput/ChatInputMockView').default,
    },
    'layout.LineProgressBarView': {
        lazy: () => require('./layout/ProgressBar/LineProgressBarMockView').default,
    },
    'layout.CircleProgressBarView': {
        lazy: () => require('./layout/ProgressBar/CircleProgressBarMockView').default,
    },
    'layout.TooltipView': {
        lazy: () => require('./layout/Tooltip/TooltipMockView').default,
    },
    'layout.HeaderView': {
        lazy: () => require('./layout/Header/HeaderMockView').default,
    },
    'content.AvatarView': {
        lazy: () => require('./content/Avatar/AvatarMockView').default,
    },
    'content.AccordionItemView': {
        lazy: () => require('./content/Accordion/AccordionItemMockView').default,
    },
    'content.AccordionView': {
        lazy: () => require('./content/Accordion/AccordionMockView').default,
    },
    'content.MenuView': {
        lazy: () => require('./content/Menu/MenuMockView').default,
    },
    'content.MenuItemView': {
        lazy: () => require('./content/Menu/MenuItemMockView').default,
    },
    'content.BadgeView': {
        lazy: () => require('./content/Badge/BadgeMockView').default,
    },
    'form.CheckboxFieldView': {
        lazy: () => require('./form/CheckboxField/CheckboxFieldMockView').default,
    },
    'form.RadioFieldView': {
        lazy: () => require('./form/RadioField/RadioFieldMockView').default,
    },
    'form.DropDownFieldItemView': {
        lazy: () => require('./form/DropDownField/DropDownItemMockView').default,
    },
    'list.PaginationButtonView': {
        lazy: () => require('./list/Pagination/PaginationButtonMockView').default,
    },
    'list.FlexGridView': {
        lazy: () => require('./list/FlexGrid/FlexGridMockView').default,
    },
    'list.PaginationMoreView': {
        lazy: () => require('./list/Pagination/PaginationMoreMockView').default,
    },
    'list.CheckboxColumnView': {
        lazy: () => require('./list/Grid/CheckboxColumnMockView').default,
    },
    'list.EmptyView': {
        lazy: () => require('./list/Empty/EmptyMockView').default,
    },
    'format.DefaultFormatterView': {
        lazy: () => require('./format/DefaultFormatterMockView').default,
    },
    'list.ContentColumnView': {
        lazy: () => require('./list/Grid/ContentColumnMockView').default,
    },
    'list.DiagramColumnView': {
        lazy: () => require('./list/Grid/DiagramColumnMockView').default,
    },
    'content.IconView': {
        lazy: () => require('./content/Icon/IconMockView').default,
    },
    'form.InputFieldView': {
        lazy: () => require('./form/InputField/InputFieldMockView').default,
    },
    'form.FormView': {
        lazy: () => require('./form/Form/FormMockView').default,
    },
    'form.SliderFieldView': {
        lazy: () => require('./form/SliderField/SliderFieldMockView').default,
    },
    'form.DateRangeFieldView': {
        lazy: () => require('./form/DateRangeField/DateRangeFieldMockView').default,
    },
    'form.TimeFieldView': {
        lazy: () => require('./form/TimeField/TimeFieldMockView').default,
    },
    'form.CheckboxListFieldView': {
        lazy: () => require('./form/CheckboxListField/CheckboxListFieldMockView').default,
    },
    'modal.ModalView': {
        lazy: () => require('./modal/Modal/ModalMockView').default,
    },
    'nav.NavButtonView': {
        lazy: () => require('./nav/Nav/NavButtonMockView').default,
    },
    'nav.ButtonGroupView': {
        lazy: () => require('./nav/ButtonGroup/ButtonGroupMockView').default,
    },
    'nav.NavIconView': {
        lazy: () => require('./nav/Nav/NavIconMockView').default,
    },
    'nav.NavLinkView': {
        lazy: () => require('./nav/Nav/NavLinkMockView').default,
    },
    'nav.NavTabsView': {
        lazy: () => require('./nav/Nav/NavTabsMockView').default,
    },
    'nav.NavBarView': {
        lazy: () => require('./nav/Nav/NavBarMockView').default,
    },
    'nav.NavListView': {
        lazy: () => require('./nav/Nav/NavListMockView').default,
    },
    'nav.TreeItemView': {
        lazy: () => require('./list/TreeTable/TreeItemMockView').default,
    },
    'form.TimeRangeFieldView': {
        lazy: () => require('./form/TimeRangeField/TimeRangeFieldMockView').default,
    },
    'typography.TitleView': {
        lazy: () => require('./typography/Title/TitleMockView').default,
    },
    'typography.TextView': {
        lazy: () => require('./typography/Text/TextMockView').default,
    },
    'form.RateFieldView': {
        lazy: () => require('./form/RateField/RateFieldMockView').default,
    },
};
