<page>
  <title>Headless UI</title>
  <url>https://headlessui.com/</url>
  <content>What is your refund policy?

If you're unhappy with your purchase, we'll refund you in full.

Do you offer technical support</content>
</page>

<page>
  <title>Headless UI</title>
  <url>https://headlessui.com/v1/vue</url>
  <content>[](https://headlessui.com/v1)

v1.7

[GitHub repository](https://github.com/tailwindlabs/headlessui)

Completely unstyled, fully accessible UI components, designed to integrate beautifully with Tailwind CSS.
---------------------------------------------------------------------------------------------------------

[React](https://headlessui.com/v1)[Vue](https://headlessui.com/v1/vue)

[Menu (Dropdown)](https://headlessui.com/v1/vue/menu)

[Listbox (Select)](https://headlessui.com/v1/vue/listbox)

[Combobox (Autocomplete)](https://headlessui.com/v1/vue/combobox)

[Switch (Toggle)](https://headlessui.com/v1/vue/switch)

[Disclosure](https://headlessui.com/v1/vue/disclosure)

[Dialog (Modal)](https://headlessui.com/v1/vue/dialog)

[Popover](https://headlessui.com/v1/vue/popover)

[Radio Group](https://headlessui.com/v1/vue/radio-group)

[Tabs](https://headlessui.com/v1/vue/tabs)

[Transition](https://headlessui.com/v1/vue/transition)</content>
</page>

<page>
  <title>Headless UI</title>
  <url>https://headlessui.com/react/menu</url>
  <content>Menus offer an easy way to build custom, accessible dropdown components with robust support for keyboard navigation.

[](#installation)
-----------------

To get started, install Headless UI via npm:

    npm install @headlessui/react

[](#basic-example)
------------------

Menus are built using the `Menu`, `MenuButton`, `MenuItems`, and `MenuItem` components:

    import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
    
    function Example() {
      return (
        <Menu>
          <MenuButton>My account</MenuButton>
          <MenuItems anchor="bottom">
            <MenuItem>
              <a className="block data-focus:bg-blue-100" href="/settings">
                Settings
              </a>
            </MenuItem>
            <MenuItem>
              <a className="block data-focus:bg-blue-100" href="/support">
                Support
              </a>
            </MenuItem>
            <MenuItem>
              <a className="block data-focus:bg-blue-100" href="/license">
                License
              </a>
            </MenuItem>
          </MenuItems>
        </Menu>
      )
    }

The `MenuButton` will automatically open and close the `MenuItems` when clicked, and when the menu is opened the list of items receives focus and is navigable via the keyboard.

[](#styling)
------------

Headless UI keeps track of a lot of state about each component, like which menu item is currently focused via the keyboard, whether a popover is open or closed, or which listbox option is currently selected.

But because the components are headless and completely unstyled out of the box, you can't see this information in your UI until you provide the styles you want for each state yourself.

### [](#using-data-attributes)

The easiest way to style the different states of a Headless UI component is using the `data-*` attributes that each component exposes.

For example, the `MenuButton` component exposes a `data-active` attribute, which tells you if the menu is currently open, and the `MenuItem` component exposes a `data-focus` attribute, which tells you if the menu item is currently focused via the mouse or keyboard.

    <!-- Rendered `MenuButton`, `MenuItems`, and `MenuItem` -->
    <button data-active>Options</button>
    <div data-open>
      <a href="/settings">Settings</a>
      <a href="/support" data-focus>Support</a>
      <a href="/license">License</a>
    </div>

Use the [CSS attribute selector](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors) to conditionally apply styles based on the presence of these data attributes. If you're using Tailwind CSS, the [data attribute modifier](https://tailwindcss.com/docs/hover-focus-and-other-states#data-attributes) makes this easy:

    import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
    
    const links = [
      { href: '/settings', label: 'Settings' },
      { href: '/support', label: 'Support' },
      { href: '/license', label: 'License' },
    ]
    
    function Example() {
      return (
        <Menu>
          <MenuButton className="data-active:bg-blue-200">My account</MenuButton>      <MenuItems anchor="bottom">
            {links.map((link) => (
              <MenuItem key={link.href} className="block data-focus:bg-blue-100">            <a href={link.href}>{link.label}</a>
              </MenuItem>
            ))}
          </MenuItems>
        </Menu>
      )
    }
    

See the [component API](#component-api) for a list of all the available data attributes.

### [](#using-render-props)

Each component also exposes information about its current state via [render props](https://reactjs.org/docs/render-props.html) that you can use to conditionally apply different styles or render different content.

For example, the `MenuButton` component exposes an `active` state, which tells you if the menu is currently open, and the `MenuItem` component exposes a `focus` state, which tells you if the menu item is currently focused via the mouse or keyboard.

    import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
    import clsx from 'clsx'
    import { Fragment } from 'react'
    
    const links = [
      { href: '/settings', label: 'Settings' },
      { href: '/support', label: 'Support' },
      { href: '/license', label: 'License' },
    ]
    
    function Example() {
      return (
        <Menu>
          <MenuButton as={Fragment}>        {({ active }) => <button className={clsx(active && 'bg-blue-200')}>My account</button>}      </MenuButton>      <MenuItems anchor="bottom">
            {links.map((link) => (
              <MenuItem key={link.href} as={Fragment}>            {({ focus }) => (              <a className={clsx('block', focus && 'bg-blue-100')} href={link.href}>                {link.label}              </a>            )}          </MenuItem>        ))}
          </MenuItems>
        </Menu>
      )
    }
    

See the [component API](#component-api) for a list of all the available render props.

[](#examples)
-------------

### [](#using-with-buttons)

In addition to links, you can also use buttons in a `MenuItem`. This is useful when you want to trigger an action like opening a dialog or submitting a form.

    import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
    
    function Example() {
      function showSettingsDialog() {
        alert('Open settings dialog!')
      }
    
      return (
        <Menu>
          <MenuButton>My account</MenuButton>
          <MenuItems anchor="bottom">
            <MenuItem>          <button onClick={showSettingsDialog} className="block w-full text-left data-focus:bg-blue-100">            Settings          </button>        </MenuItem>        <MenuItem>
              <a className="block data-focus:bg-blue-100" href="/support">
                Support
              </a>
            </MenuItem>
            <MenuItem>
              <a className="block data-focus:bg-blue-100" href="/license">
                License
              </a>
            </MenuItem>
            <form action="/logout" method="post">          <MenuItem>            <button type="submit" className="block w-full text-left data-focus:bg-blue-100">              Sign out            </button>          </MenuItem>        </form>      </MenuItems>
        </Menu>
      )
    }
    

### [](#disabling-an-item)

Use the `disabled` prop to disable a `MenuItem` and prevent it from being selected:

    import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
    
    function Example() {
      return (
        <Menu>
          <MenuButton>My account</MenuButton>
          <MenuItems anchor="bottom">
            <MenuItem>
              <a className="block data-focus:bg-blue-100" href="/settings">
                Settings
              </a>
            </MenuItem>
            <MenuItem>
              <a className="block data-focus:bg-blue-100" href="/support">
                Support
              </a>
            </MenuItem>
            <MenuItem>
              <a className="block data-focus:bg-blue-100" href="/license">
                License
              </a>
            </MenuItem>
            <MenuItem disabled>          <a className="block data-disabled:opacity-50" href="/invite-a-friend">            Invite a friend (coming soon!)          </a>        </MenuItem>      </MenuItems>
        </Menu>
      )
    }
    

### [](#separating-items)

Use the `MenuSeparator` component to add a visual separation between items in a menu.

    import { Menu, MenuButton, MenuItem, MenuItems, MenuSeparator } from '@headlessui/react'
    
    function Example() {
      return (
        <Menu>
          <MenuButton>My account</MenuButton>
          <MenuItems anchor="bottom">
            <MenuItem>
              <a className="block data-focus:bg-blue-100" href="/settings">
                Settings
              </a>
            </MenuItem>
            <MenuSeparator className="my-1 h-px bg-black" />        <MenuItem>
              <a className="block data-focus:bg-blue-100" href="/support">
                Support
              </a>
            </MenuItem>
            <MenuItem>
              <a className="block data-focus:bg-blue-100" href="/license">
                License
              </a>
            </MenuItem>
          </MenuItems>
        </Menu>
      )
    }
    

### [](#grouping-items)

Use the `MenuSection`, `MenuHeading`, and `MenuSeparator` components to group items into sections with labels:

    import { Menu, MenuButton, MenuHeading, MenuItem, MenuItems, MenuSection, MenuSeparator } from '@headlessui/react'
    
    function Example() {
      return (
        <Menu>
          <MenuButton>My account</MenuButton>
          <MenuItems anchor="bottom">
            <MenuSection>          <MenuHeading className="text-sm opacity-50">Settings</MenuHeading>          <MenuItem>
                <a className="block data-focus:bg-blue-100" href="/profile">
                  My profile
                </a>
              </MenuItem>
              <MenuItem>
                <a className="block data-focus:bg-blue-100" href="/notifications">
                  Notifications
                </a>
              </MenuItem>
            </MenuSection>        <MenuSeparator className="my-1 h-px bg-black" />        <MenuSection>          <MenuHeading className="text-sm opacity-50">Support</MenuHeading>          <MenuItem>
                <a className="block data-focus:bg-blue-100" href="/support">
                  Documentation
                </a>
              </MenuItem>
              <MenuItem>
                <a className="block data-focus:bg-blue-100" href="/license">
                  License
                </a>
              </MenuItem>
            </MenuSection>      </MenuItems>
        </Menu>
      )
    }
    

### [](#setting-the-dropdown-width)

The `MenuItems` dropdown has no width set by default, but you can add one using CSS:

    import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
    
    function Example() {
      return (
        <Menu>
          <MenuButton>My account</MenuButton>
          <MenuItems anchor="bottom" className="w-52">        <MenuItem>
              <a className="block data-focus:bg-blue-100" href="/settings">
                Settings
              </a>
            </MenuItem>
            <MenuItem>
              <a className="block data-focus:bg-blue-100" href="/support">
                Support
              </a>
            </MenuItem>
            <MenuItem>
              <a className="block data-focus:bg-blue-100" href="/license">
                License
              </a>
            </MenuItem>
          </MenuItems>
        </Menu>
      )
    }
    

If you'd like the dropdown width to match the `MenuButton` width, use the `--button-width` CSS variable that's exposed on the `MenuItems` element:

    import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
    
    function Example() {
      return (
        <Menu>
          <MenuButton>My account</MenuButton>
          <MenuItems anchor="bottom" className="w-(--button-width)">        <MenuItem>
              <a className="block data-focus:bg-blue-100" href="/settings">
                Settings
              </a>
            </MenuItem>
            <MenuItem>
              <a className="block data-focus:bg-blue-100" href="/support">
                Support
              </a>
            </MenuItem>
            <MenuItem>
              <a className="block data-focus:bg-blue-100" href="/license">
                License
              </a>
            </MenuItem>
          </MenuItems>
        </Menu>
      )
    }
    

### [](#positioning-the-dropdown)

Add the `anchor` prop to the `MenuItems` to automatically position the dropdown relative to the `MenuButton`:

    import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
    
    function Example() {
      return (
        <Menu>
          <MenuButton>My account</MenuButton>
          <MenuItems anchor="bottom start">        <MenuItem>
              <a className="block data-focus:bg-blue-100" href="/settings">
                Settings
              </a>
            </MenuItem>
            <MenuItem>
              <a className="block data-focus:bg-blue-100" href="/support">
                Support
              </a>
            </MenuItem>
            <MenuItem>
              <a className="block data-focus:bg-blue-100" href="/license">
                License
              </a>
            </MenuItem>
          </MenuItems>
        </Menu>
      )
    }
    

Use the values `top`, `right`, `bottom`, or `left` to center the dropdown along the appropriate edge, or combine it with `start` or `end` to align the dropdown to a specific corner, such as `top start` or `bottom end`.

To control the gap between the button and the dropdown, use the `--anchor-gap` CSS variable:

    import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
    
    function Example() {
      return (
        <Menu>
          <MenuButton>My account</MenuButton>
          <MenuItems anchor="bottom start" className="[--anchor-gap:4px] sm:[--anchor-gap:8px]">        <MenuItem>
              <a className="block data-focus:bg-blue-100" href="/settings">
                Settings
              </a>
            </MenuItem>
            <MenuItem>
              <a className="block data-focus:bg-blue-100" href="/support">
                Support
              </a>
            </MenuItem>
            <MenuItem>
              <a className="block data-focus:bg-blue-100" href="/license">
                License
              </a>
            </MenuItem>
          </MenuItems>
        </Menu>
      )
    }
    

Additionally, you can use `--anchor-offset` to control the distance that the dropdown should be nudged from its original position, and `--anchor-padding` to control the minimum space that should exist between the dropdown and the viewport.

The `anchor` prop also supports an object API that allows you to control the `gap`, `offset`, and `padding` values using JavaScript:

    import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
    
    function Example() {
      return (
        <Menu>
          <MenuButton>My account</MenuButton>
          <MenuItems anchor={{ to: 'bottom start', gap: '4px' }}>        <MenuItem>
              <a className="block data-focus:bg-blue-100" href="/settings">
                Settings
              </a>
            </MenuItem>
            <MenuItem>
              <a className="block data-focus:bg-blue-100" href="/support">
                Support
              </a>
            </MenuItem>
            <MenuItem>
              <a className="block data-focus:bg-blue-100" href="/license">
                License
              </a>
            </MenuItem>
          </MenuItems>
        </Menu>
      )
    }
    

See the [MenuItems API](#menu-items) for more information about these options.

### [](#adding-transitions)

To animate the opening and closing of the dropdown, add the `transition` prop to the `MenuItems` component and then use CSS to style the different stages of the transition:

    import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
    
    function Example() {
      return (
        <Menu>
          <MenuButton>My account</MenuButton>
          <MenuItems
            anchor="bottom"
            transition        className="origin-top transition duration-200 ease-out data-closed:scale-95 data-closed:opacity-0"      >
            <MenuItem>
              <a className="block data-focus:bg-blue-100" href="/settings">
                Settings
              </a>
            </MenuItem>
            <MenuItem>
              <a className="block data-focus:bg-blue-100" href="/support">
                Support
              </a>
            </MenuItem>
            <MenuItem>
              <a className="block data-focus:bg-blue-100" href="/license">
                License
              </a>
            </MenuItem>
          </MenuItems>
        </Menu>
      )
    }
    

Internally, the `transition` prop is implemented in the exact same way as the `Transition` component. See the [Transition documentation](https://headlessui.com/react/transition) to learn more.

### [](#animating-with-framer-motion)

Headless UI also composes well with other animation libraries in the React ecosystem like [Framer Motion](https://www.framer.com/motion/) and [React Spring](https://www.react-spring.io/). You just need to expose some state to those libraries.

For example, to animate the menu with Framer Motion, add the `static` prop to the `MenuItems` component and then conditionally render it based on the `open` render prop:

    import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
    import { AnimatePresence, motion } from 'framer-motion'
    
    function Example() {
      return (
        <Menu>
          {({ open }) => (        <>
              <MenuButton>My account</MenuButton>
              <AnimatePresence>
                {open && (              <MenuItems
                    static                as={motion.div}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    anchor="bottom"
                    className="origin-top"
                  >
                    <MenuItem>
                      <a className="block data-focus:bg-blue-100" href="/settings">
                        Settings
                      </a>
                    </MenuItem>
                    <MenuItem>
                      <a className="block data-focus:bg-blue-100" href="/support">
                        Support
                      </a>
                    </MenuItem>
                    <MenuItem>
                      <a className="block data-focus:bg-blue-100" href="/license">
                        License
                      </a>
                    </MenuItem>
                  </MenuItems>
                )}          </AnimatePresence>
            </>
          )}    </Menu>
      )
    }
    

By default, the `Menu` will close when clicking a `MenuItem`. However, some third-party `Link` components use `event.preventDefault()` which prevents the menu from closing.

In these situations you can imperatively close the menu using the `close` render prop that's available on both the `Menu` and `MenuItem` components:

    import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
    import { MyCustomLink } from './MyCustomLink'
    
    function Example() {
      return (
        <Menu>
          <MenuButton>Terms</MenuButton>
          <MenuItems anchor="bottom">
            <MenuItem>
              {({ close }) => (            <MyCustomLink href="/" onClick={close}>              Read and accept
                </MyCustomLink>
              )}        </MenuItem>
          </MenuItems>
        </Menu>
      )
    }
    

### [](#rendering-as-different-elements)

By default, the `Menu` and its subcomponents each render a default element that is sensible for that component.

For example, `MenuButton` renders a `button` by default, and `MenuItems` renders a `div`. By contrast, `Menu` and `MenuItem` _do not render an element_, and instead render their children directly by default.

Use the `as` prop to render the component as a different element or as your own custom component, making sure your custom components [forward refs](https://react.dev/reference/react/forwardRef) so that Headless UI can wire things up correctly.

    import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
    import { forwardRef } from 'react'
    
    let MyCustomButton = forwardRef(function (props, ref) {  return <button className="..." ref={ref} {...props} />})
    function Example() {
      return (
        <Menu>
          <MenuButton as={MyCustomButton}>My account</MenuButton>      <MenuItems anchor="bottom" as="section">        <MenuItem as="a" className="block data-focus:bg-blue-100" href="/settings">          Settings
            </MenuItem>
            <MenuItem as="a" className="block data-focus:bg-blue-100" href="/support">          Support
            </MenuItem>
            <MenuItem as="a" className="block data-focus:bg-blue-100" href="/license">          License
            </MenuItem>
          </MenuItems>
        </Menu>
      )
    }
    

To tell an element to render its children directly with no wrapper element, use `as={Fragment}`.

    import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
    import { Fragment } from 'react'
    
    function Example() {
      return (
        <Menu>
          <MenuButton as={Fragment}>        <button>My account</button>      </MenuButton>      <MenuItems anchor="bottom">
            <MenuItem>
              <a className="block data-focus:bg-blue-100" href="/settings">
                Settings
              </a>
            </MenuItem>
            <MenuItem>
              <a className="block data-focus:bg-blue-100" href="/support">
                Support
              </a>
            </MenuItem>
            <MenuItem>
              <a className="block data-focus:bg-blue-100" href="/license">
                License
              </a>
            </MenuItem>
          </MenuItems>
        </Menu>
      )
    }
    

This is important if you are using an interactive element like an `<a>` tag inside the `MenuItem`. If the `MenuItem` had an `as="div"`, then the props provided by Headless UI would be forwarded to the `div` instead of the `a`, which means that you can't go to the URL provided by the `<a>` tag anymore via your keyboard.

### [](#integrating-with-next-js)

Prior to Next.js v13, the `Link` component did not forward unknown props to the underlying `a` element, preventing the menu from closing on click when used inside a `MenuItem`.

If you're using Next.js v12 or older, you can work around this issue by creating your own component that wraps `Link` and forwards unknown props to the child `a` element:

    import { forwardRef } from 'react'
    import Link from 'next/link'
    import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react'
    
    const MyLink = forwardRef((props, ref) => {  let { href, children, ...rest } = props  return (    <Link href={href}>      <a ref={ref} {...rest}>        {children}      </a>    </Link>  )})
    function Example() {
      return (
        <Menu>
          <MenuButton>My account</MenuButton>
          <MenuItems anchor="bottom">
            <MenuItem>
              <MyLink href="/settings">Settings</MyLink>        </MenuItem>
          </MenuItems>
        </Menu>
      )
    }
    

This will ensure that all of the event listeners Headless UI needs to add to the `a` element are properly applied.

This behavior was changed in Next.js v13 making this workaround no longer necessary.

[](#keyboard-interaction)
-------------------------

Divides a list of `MenuItem` components into sections with proper accessibility semantics.

Adds an accessible label to a `MenuSection`.

Separates two `MenuSection` components, with proper accessibility semantics.</content>
</page>

<page>
  <title>Headless UI</title>
  <url>https://headlessui.com/react/dialog</url>
  <content>A fully-managed, renderless dialog component jam-packed with accessibility and keyboard features, perfect for building completely custom dialogs and alerts.

[](#installation)
-----------------

To get started, install Headless UI via npm:

    npm install @headlessui/react

[](#basic-example)
------------------

Dialogs are built using the `Dialog`, `DialogPanel`, `DialogTitle`, and `Description` components:

    import { Description, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
    import { useState } from 'react'
    
    function Example() {
      let [isOpen, setIsOpen] = useState(false)
    
      return (
        <>
          <button onClick={() => setIsOpen(true)}>Open dialog</button>
          <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
            <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
              <DialogPanel className="max-w-lg space-y-4 border bg-white p-12">
                <DialogTitle className="font-bold">Deactivate account</DialogTitle>
                <Description>This will permanently deactivate your account</Description>
                <p>Are you sure you want to deactivate your account? All of your data will be permanently removed.</p>
                <div className="flex gap-4">
                  <button onClick={() => setIsOpen(false)}>Cancel</button>
                  <button onClick={() => setIsOpen(false)}>Deactivate</button>
                </div>
              </DialogPanel>
            </div>
          </Dialog>
        </>
      )
    }

How you open and close the dialog is entirely up to you. You open a dialog by passing `true` to the `open` prop, and close it by passing `false`. An `onClose` callback is also required for when the dialog is dismissed by pressing the `Esc` key or by clicking outside of the `DialogPanel`.

[](#styling)
------------

Style the `Dialog` and `DialogPanel` components using the `className` or `style` props like you would with any other element. You can also introduce additional elements if needed to achieve a particular design.

    import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
    import { useState } from 'react'
    
    function Example() {
      let [isOpen, setIsOpen] = useState(true)
    
      return (
        <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">        <DialogPanel className="max-w-lg space-y-4 border bg-white p-12">          <DialogTitle>Deactivate account order</DialogTitle>
    
              {/* ... */}
            </DialogPanel>
          </div>
        </Dialog>
      )
    }
    

Clicking outside the `DialogPanel` component will close the dialog, so keep that in mind when deciding which styles to apply to which elements.

[](#examples)
-------------

### [](#showing-hiding-the-dialog)

Dialogs are controlled components, meaning that you have to provide and manage the open state yourself using the `open` prop and the `onClose` callback.

The `onClose` callback is called when an dialog is dismissed, which happens when the user presses the Esc key or clicks outside the `DialogPanel`. In this callback set the `open` state back to `false` to close the dialog.

    import { Description, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
    import { useState } from 'react'
    
    function Example() {
      // The open/closed state lives outside of the `Dialog` and is managed by you
      let [isOpen, setIsOpen] = useState(true)
      function async handleDeactivate() {
        await fetch('/deactivate-account', { method: 'POST' })
        setIsOpen(false)  }
    
      return (
        /*
          Pass `isOpen` to the `open` prop, and use `onClose` to set
          the state back to `false` when the user clicks outside of
          the dialog or presses the escape key.
        */
        <Dialog open={isOpen} onClose={() => setIsOpen(false)}>      <DialogPanel>
            <DialogTitle>Deactivate account</DialogTitle>
            <Description>This will permanently deactivate your account</Description>
            <p>Are you sure you want to deactivate your account? All of your data will be permanently removed.</p>
    
            {/*
              You can render additional buttons to dismiss your
              dialog by setting `isOpen` to `false`.
            */}
            <button onClick={() => setIsOpen(false)}>Cancel</button>
            <button onClick={handleDeactivate}>Deactivate</button>
          </DialogPanel>
        </Dialog>  )
    }
    

For situations where you don't have easy access to your open/close state, Headless UI provides a `CloseButton` component that will close the nearest dialog ancestor when clicked. You can use the `as` prop to customize which element is being rendered:

    import { CloseButton } from '@headlessui/react'
    import { MyDialog } from './my-dialog'
    import { MyButton } from './my-button'
    
    function Example() {
      return (
        <MyDialog>
          {/* ... */}
          <CloseButton as={MyButton}>Cancel</CloseButton>    </MyDialog>
      )
    }
    

If you require more control, you can also use the `useClose` hook to imperatively close the dialog, say after running an async action:

    import { Dialog, useClose } from '@headlessui/react'
    
    function MySearchForm() {
      let close = useClose()
      return (
        <form
          onSubmit={async (event) => {
            event.preventDefault()
            /* Perform search... */
            close()      }}
        >
          <input type="search" />
          <button type="submit">Submit</button>
        </form>
      )
    }
    
    function Example() {
      return (
        <Dialog>
          <MySearchForm />
          {/* ... */}
        </Dialog>
      )
    }
    

The `useClose` hook must be used in a component that's nested within the `Dialog`, otherwise it will not work.

### [](#adding-a-backdrop)

Use the `DialogBackdrop` component to add a backdrop behind your dialog panel. We recommend making the backdrop a sibling to your panel container:

    import { Description, Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
    import { useState } from 'react'
    
    function Example() {
      let [isOpen, setIsOpen] = useState(false)
    
      return (
        <>
          <button onClick={() => setIsOpen(true)}>Open dialog</button>
          <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
            {/* The backdrop, rendered as a fixed sibling to the panel container */}
            <DialogBackdrop className="fixed inset-0 bg-black/30" />
            {/* Full-screen container to center the panel */}
            <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
              {/* The actual dialog panel  */}
              <DialogPanel className="max-w-lg space-y-4 bg-white p-12">
                <DialogTitle className="font-bold">Deactivate account</DialogTitle>
                <Description>This will permanently deactivate your account</Description>
                <p>Are you sure you want to deactivate your account? All of your data will be permanently removed.</p>
                <div className="flex gap-4">
                  <button onClick={() => setIsOpen(false)}>Cancel</button>
                  <button onClick={() => setIsOpen(false)}>Deactivate</button>
                </div>
              </DialogPanel>
            </div>
          </Dialog>
        </>
      )
    }
    

This lets you [transition](#transitions) the backdrop and panel independently with their own animations, and rendering it as a sibling ensures that it doesn't interfere with your ability to scroll long dialogs.

### [](#scrollable-dialogs)

Making a dialog scrollable is handled entirely in CSS, and the specific implementation depends on the design you are trying to achieve.

Here's an example where the entire panel container is scrollable, and the panel itself moves as you scroll:

    import { Description, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
    import { useState } from 'react'
    
    function Example() {
      let [isOpen, setIsOpen] = useState(false)
    
      return (
        <>
          <button onClick={() => setIsOpen(true)}>Open dialog</button>
          <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
            <div className="fixed inset-0 w-screen overflow-y-auto p-4">          <div className="flex min-h-full items-center justify-center">            <DialogPanel className="max-w-lg space-y-4 border bg-white p-12">
                  <DialogTitle className="font-bold">Deactivate account</DialogTitle>
                  <Description>This will permanently deactivate your account</Description>
                  <p>Are you sure you want to deactivate your account? All of your data will be permanently removed.</p>
                  <div className="flex gap-4">
                    <button onClick={() => setIsOpen(false)}>Cancel</button>
                    <button onClick={() => setIsOpen(false)}>Deactivate</button>
                  </div>
                </DialogPanel>
              </div>        </div>      </Dialog>
        </>
      )
    }
    

When creating a scrollable dialog with a backdrop, make sure the backdrop is rendered _behind_ the scrollable container, otherwise the scroll wheel won't work when hovering over the backdrop, and the backdrop may obscure the scrollbar and prevent users from clicking it with their mouse.

### [](#managing-initial-focus)

By default, the `Dialog` component will focus the dialog element itself when opened, and pressing the Tab key will cycle through any focusable elements within the dialog.

Focus is trapped within the dialog as long as it is rendered, so tabbing to the end will start cycling back through the beginning again. All other application elements outside of the dialog will be marked as inert and thus not focusable.

If you'd like something other than the dialog's root element to receive focus when your dialog is opened, you can add the `autoFocus` prop to any Headless UI form control:

    import { Checkbox, Dialog, DialogPanel, DialogTitle, Field, Label } from '@headlessui/react'
    import { useState } from 'react'
    
    function Example() {
      let [isOpen, setIsOpen] = useState(true)
      let [isGift, setIsGift] = useState(false)
    
      function completeOrder() {
        // ...
      }
    
      return (
        <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
          <DialogPanel>
            <DialogTitle>Complete your order</DialogTitle>
    
            <p>Your order is all ready!</p>
    
            <Field>
              <Checkbox autoFocus value={isGift} onChange={setIsGift} />          <Label>This order is a gift</Label>
            </Field>
            <button onClick={() => setIsOpen(false)}>Cancel</button>
            <button onClick={completeOrder}>Complete order</button>
          </DialogPanel>
        </Dialog>
      )
    }
    

If the element you want to focus is not a Headless UI form control, you can add the `data-autofocus` attribute instead:

    import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
    import { useState } from 'react'
    
    function Example() {
      let [isOpen, setIsOpen] = useState(true)
    
      function completeOrder() {
        // ...
      }
    
      return (
        <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
          <DialogPanel>
            <DialogTitle>Complete your order</DialogTitle>
    
            <p>Your order is all ready!</p>
    
            <button onClick={() => setIsOpen(false)}>Cancel</button>
            <button data-autofocus onClick={completeOrder}>          Complete order
            </button>
          </DialogPanel>
        </Dialog>
      )
    }
    

### [](#rendering-to-a-portal)

Because of accessibility concerns, the `Dialog` component is automatically rendered in a [portal](https://reactjs.org/docs/portals.html) under-the-hood.

Since dialogs and their backdrops take up the full page, you typically want to render them as a sibling to the root-most node of your React application. That way you can rely on natural DOM ordering to ensure that their content is rendered on top of your existing application UI.

It renders something like this:

    <body>
      <div id="your-app">
        <!-- ... -->
      </div>
      <div id="headlessui-portal-root">
        <!-- Rendered `Dialog` -->
      </div>
    </body>

This also makes it easy to apply scroll-locking to the rest of your application, as well as ensure that your dialog's contents and backdrop are unobstructed to receive focus and click events.

### [](#adding-transitions)

To animate the opening and closing of the dialog, add the `transition` prop to the `Dialog` component and then use CSS to style the different stages of the transition:

    import { Description, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
    import { useState } from 'react'
    
    function Example() {
      let [isOpen, setIsOpen] = useState(false)
    
      return (
        <>
          <button onClick={() => setIsOpen(true)}>Open dialog</button>
          <Dialog
            open={isOpen}
            onClose={() => setIsOpen(false)}
            transition        className="fixed inset-0 flex w-screen items-center justify-center bg-black/30 p-4 transition duration-300 ease-out data-closed:opacity-0"      >
            <DialogPanel className="max-w-lg space-y-4 bg-white p-12">
              <DialogTitle className="font-bold">Deactivate account</DialogTitle>
              <Description>This will permanently deactivate your account</Description>
              <p>Are you sure you want to deactivate your account? All of your data will be permanently removed.</p>
              <div className="flex gap-4">
                <button onClick={() => setIsOpen(false)}>Cancel</button>
                <button onClick={() => setIsOpen(false)}>Deactivate</button>
              </div>
            </DialogPanel>
          </Dialog>
        </>
      )
    }
    

To animate your backdrop and panel separately, add the `transition` prop to the `DialogBackdrop` and `DialogPanel` components directly:

    import { Description, Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
    import { useState } from 'react'
    
    function Example() {
      let [isOpen, setIsOpen] = useState(false)
    
      return (
        <>
          <button onClick={() => setIsOpen(true)}>Open dialog</button>
          <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
            <DialogBackdrop transition className="fixed inset-0 bg-black/30 duration-300 ease-out data-closed:opacity-0" />
            <div className="fixed inset-0 flex w-screen items-center justify-center p-4">          <DialogPanel            transition
                className="max-w-lg space-y-4 bg-white p-12 duration-300 ease-out data-closed:scale-95 data-closed:opacity-0"
              >
                <DialogTitle className="text-lg font-bold">Deactivate account</DialogTitle>            <Description>This will permanently deactivate your account</Description>            <p>Are you sure you want to deactivate your account? All of your data will be permanently removed.</p>
                <div className="flex gap-4">
                  <button onClick={() => setIsOpen(false)}>Cancel</button>
                  <button onClick={() => setIsOpen(false)}>Deactivate</button>
                </div>
              </DialogPanel>
            </div>
          </Dialog>
        </>
      )
    }
    

Internally, the `transition` prop is implemented in the exact same way as the `Transition` component. See the [Transition documentation](https://headlessui.com/react/transition) to learn more.

### [](#animating-with-framer-motion)

Headless UI also composes well with other animation libraries in the React ecosystem like [Framer Motion](https://www.framer.com/motion/) and [React Spring](https://www.react-spring.io/). You just need to expose some state to those libraries.

For example, to animate the dialog with Framer Motion, add the `static` prop to the `Dialog` component and then conditionally render it based on the `open` state:

    import { Description, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
    import { AnimatePresence, motion } from 'framer-motion'
    import { useState } from 'react'
    
    function Example() {
      let [isOpen, setIsOpen] = useState(false)
    
      return (
        <>
          <button onClick={() => setIsOpen(true)}>Open dialog</button>
          <AnimatePresence>
            {isOpen && (          <Dialog static open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">            <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/30"
                />
                <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                  <DialogPanel
                    as={motion.div}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="max-w-lg space-y-4 bg-white p-12"
                  >
                    <DialogTitle className="text-lg font-bold">Deactivate account</DialogTitle>
                    <Description>This will permanently deactivate your account</Description>
                    <p>Are you sure you want to deactivate your account? All of your data will be permanently removed.</p>
                    <div className="flex gap-4">
                      <button onClick={() => setIsOpen(false)}>Cancel</button>
                      <button onClick={() => setIsOpen(false)}>Deactivate</button>
                    </div>
                  </DialogPanel>
                </div>
              </Dialog>        )}      </AnimatePresence>
        </>
      )
    }
    

The `open` prop is still used to manage scroll-locking and focus trapping, but as long as `static` is present, the actual element will always be rendered regardless of the `open` value, which allows you to control it yourself externally.

[](#keyboard-interaction)
-------------------------

[](#component-api)
------------------

### [](#dialog)

The main dialog component.

### [](#dialog-backdrop)

The visual backdrop behind your the dialog panel.

### [](#dialog-panel)

The main content area of your dialog. Clicking outside of this component will trigger the `onClose` of the `Dialog` component.

### [](#dialog-title)

This is the title for your dialog. When this is used, it will set the `aria-labelledby` on the dialog.

### [](#close-button)

This button will close the nearest `Dialog` ancestor when clicked. Alternatively, use the `useClose` hook to imperatively close the dialog.</content>
</page>

<page>
  <title>Headless UI</title>
  <url>https://headlessui.com/react/disclosure</url>
  <content>A simple, accessible foundation for building custom UIs that show and hide content, like togglable accordion panels.

[](#installation)
-----------------

To get started, install Headless UI via npm:

    npm install @headlessui/react

[](#basic-example)
------------------

Disclosures are built using the `Disclosure`, `DisclosureButton`, and `DisclosurePanel` components.

The button will automatically open/close the panel when clicked, and all components will receive the appropriate `aria-*` related attributes like `aria-expanded` and `aria-controls`.

    import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
    
    function Example() {
      return (
        <Disclosure>
          <DisclosureButton className="py-2">Is team pricing available?</DisclosureButton>
          <DisclosurePanel className="text-gray-500">
            Yes! You can purchase a license that you can share with your entire team.
          </DisclosurePanel>
        </Disclosure>
      )
    }

[](#styling)
------------

Headless UI keeps track of a lot of state about each component, like which listbox option is currently selected, whether a popover is open or closed, or which item in a disclosure is currently focused via the keyboard.

But because the components are headless and completely unstyled out of the box, you can't see this information in your UI until you provide the styles you want for each state yourself.

### [](#using-data-attributes)

The easiest way to style the different states of a Headless UI component is using the `data-*` attributes that each component exposes.

For example, the `DisclosureButton` component exposes a `data-open` attribute, which tells you if the disclosure is currently open.

    <!-- Rendered `Disclosure` -->
    <button data-open>Do you offer technical support?</button>
    <div data-open>No</div>

Use the [CSS attribute selector](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors) to conditionally apply styles based on the presence of these data attributes. If you're using Tailwind CSS, the [data attribute modifier](https://tailwindcss.com/docs/hover-focus-and-other-states#data-attributes) makes this easy:

    import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
    import { ChevronDownIcon } from '@heroicons/react/20/solid'
    
    function Example() {
      return (
        <Disclosure>
          <DisclosureButton className="group flex items-center gap-2">
            Do you offer technical support?
            <ChevronDownIcon className="w-5 group-data-open:rotate-180" />      </DisclosureButton>
          <DisclosurePanel>No</DisclosurePanel>
        </Disclosure>
      )
    }
    

See the [component API](#component-api) for a list of all the available data attributes.

### [](#using-render-props)

Each component also exposes information about its current state via [render props](https://reactjs.org/docs/render-props.html) that you can use to conditionally apply different styles or render different content.

For example, the `DisclosureButton` component exposes an `open` state, which tells you if the disclosure is currently open.

    import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
    import { ChevronDownIcon } from '@heroicons/react/20/solid'
    import clsx from 'clsx'
    
    function Example() {
      return (
        <Disclosure>
          {({ open }) => (        <>
              <DisclosureButton className="flex items-center gap-2">
                Do you offer technical support?
                <ChevronDownIcon className={clsx('w-5', open && 'rotate-180')} />          </DisclosureButton>
              <DisclosurePanel>No</DisclosurePanel>
            </>
          )}    </Disclosure>
      )
    }
    

See the [component API](#component-api) for a list of all the available render props.

[](#examples)
-------------

### [](#adding-transitions)

To animate the opening and closing of the disclosure panel, add the `transition` prop to the `DisclosurePanel` component and then use CSS to style the different stages of the transition:

    import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
    
    function Example() {
      return (
        <Disclosure as="div" className="w-full max-w-md">
          <DisclosureButton className="w-full border-b pb-2 text-left">Is team pricing available?</DisclosureButton>
          <div className="overflow-hidden py-2">
            <DisclosurePanel
              transition          className="origin-top transition duration-200 ease-out data-closed:-translate-y-6 data-closed:opacity-0"        >
              Yes! You can purchase a license that you can share with your entire team.
            </DisclosurePanel>
          </div>
        </Disclosure>
      )
    }
    

Internally, the `transition` prop is implemented in the exact same way as the `Transition` component. See the [Transition documentation](https://headlessui.com/react/transition) to learn more.

### [](#animating-with-framer-motion)

Headless UI also composes well with other animation libraries in the React ecosystem like [Framer Motion](https://www.framer.com/motion/) and [React Spring](https://www.react-spring.io/). You just need to expose some state to those libraries.

For example, to animate the menu with Framer Motion, add the `static` prop to the `DisclosurePanel` component and then conditionally render it based on the `open` render prop:

    import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
    import { AnimatePresence, easeOut, motion } from 'framer-motion'
    import { Fragment } from 'react'
    
    function Example() {
      return (
        <Disclosure as="div" className="w-full max-w-md">      {({ open }) => (
            <>
              <DisclosureButton className="w-full border-b pb-2 text-left">Is team pricing available?</DisclosureButton>
              <div className="overflow-hidden py-2">
                <AnimatePresence>
                  {open && (
                    <DisclosurePanel static as={Fragment}>                  <motion.div
                        initial={{ opacity: 0, y: -24 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -24 }}
                        transition={{ duration: 0.2, ease: easeOut }}
                        className="origin-top"
                      >
                        Yes! You can purchase a license that you can share with your entire team.
                      </motion.div>
                    </DisclosurePanel>
                  )}
                </AnimatePresence>
              </div>
            </>      )}
        </Disclosure>
      )
    }
    

### [](#closing-disclosures-manually)

To close a disclosure manually when clicking a child of its panel, render that child as a `CloseButton`. You can use the `as` prop to customize which element is being rendered.

    import { CloseButton, Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
    import MyLink from './MyLink'
    
    function Example() {
      return (
        <Disclosure>
          <DisclosureButton>Open mobile menu</DisclosureButton>
          <DisclosurePanel>
            <CloseButton as={MyLink} href="/home">          Home        </CloseButton>      </DisclosurePanel>
        </Disclosure>
      )
    }
    

This is especially useful when using disclosures for things like mobile menus that contain links where you want the disclosure to close when navigating to the next page.

The `Disclosure` and `DisclosurePanel` also expose a `close` render prop which you can use to imperatively close the panel, say after running an async action:

    import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
    
    function Example() {
      return (
        <Disclosure>
          <DisclosureButton>Terms</DisclosureButton>
          <DisclosurePanel>
            {({ close }) => (          <button            onClick={async () => {              await fetch('/accept-terms', { method: 'POST' })              close()            }}          >            Read and accept          </button>        )}      </DisclosurePanel>
        </Disclosure>
      )
    }
    

By default the `DisclosureButton` receives focus after calling `close`, but you can change this by passing a ref into `close(ref)`.

Finally, Headless UI also provides a `useClose` hook that can be used to imperatively close the nearest disclosure ancestor when you don't have easy access to the `close` render prop, such as in a nested component:

    import { Disclosure, DisclosureButton, DisclosurePanel, useClose } from '@headlessui/react'
    
    function MySearchForm() {
      let close = useClose()
      return (
        <form
          onSubmit={(event) => {
            event.preventDefault()
            /* Perform search... */
            close()      }}
        >
          <input type="search" />
          <button type="submit">Submit</button>
        </form>
      )
    }
    
    function Example() {
      return (
        <Disclosure>
          <DisclosureButton>Filters</DisclosureButton>
          <DisclosurePanel>
            <MySearchForm />
            {/* ... */}
          </DisclosurePanel>
        </Disclosure>
      )
    }
    

The `useClose` hook must be used in a component that's nested within the `Disclosure`, otherwise it will not work.

### [](#rendering-as-different-elements)

`Disclosure` and its subcomponents each render a default element that is sensible for that component: the `Button` renders a `<button>`, `Panel` renders a `<div>`. By contrast, the root `Disclosure` component _does not render an element_, and instead renders its children directly by default.

Use the `as` prop to render the component as a different element or as your own custom component, making sure your custom components [forward refs](https://react.dev/reference/react/forwardRef) so that Headless UI can wire things up correctly.

    import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
    import { forwardRef } from 'react'
    
    let MyCustomButton = forwardRef(function (props, ref) {  return <button className="..." ref={ref} {...props} />})
    function Example() {
      return (
        <Disclosure as="div">      <DisclosureButton as={MyCustomButton}>What languages do you support?</DisclosureButton>      <DisclosurePanel as="ul">        <li>HTML</li>
            <li>CSS</li>
            <li>JavaScript</li>
          </DisclosurePanel>
        </Disclosure>
      )
    }
    

[](#keyboard-interaction)
-------------------------

[](#component-api)
------------------

### [](#disclosure)

The main disclosure component.

### [](#disclosure-button)

The trigger component that toggles a Disclosure.

### [](#disclosure-panel)

This component contains the contents of your disclosure.

### [](#close-button)

This button will close the nearest `DisclosurePanel` ancestor when clicked. Alternatively, use the `useClose` hook to imperatively close the disclosure panel.</content>
</page>

<page>
  <title>Headless UI</title>
  <url>https://headlessui.com/react/transition</url>
  <content>Control the transition styles of conditionally rendered elements, including nested child transitions, using CSS classes.

[](#installation)
-----------------

To get started, install Headless UI via npm:

    npm install @headlessui/react

[](#basic-example)
------------------

To transition a conditionally rendered element, wrap it in the `Transition` component and use the `show` prop to indicate whether it is open or closed.

Then, use native CSS transition styles to apply an animation, specifying the element's closed styles by targeting the `data-closed` attribute that the `Transition` component exposes.

    import { Transition } from '@headlessui/react'
    import { useState } from 'react'
    
    function Example() {
      const [open, setOpen] = useState(false)
    
      return (
        <>
          <button onClick={() => setOpen((open) => !open)}>Toggle</button>
          <Transition show={open}>
            <div className="transition duration-300 ease-in data-closed:opacity-0">I will fade in and out</div>
          </Transition>
        </>
      )
    }

Styles defined with the `data-closed` attribute will be used as the starting point when transitioning in as well as the ending point when transitioning out.

For more complex transitions, you can also use the `data-enter`, `data-leave`, and `data-transition` attributes to apply styles at the different stages of the transition.

[](#examples)
-------------

### [](#different-enter-leave-transitions)

Use the `data-enter` and `data-leave` attributes to apply different transition styles when entering and leaving:

    import { Transition } from '@headlessui/react'
    import clsx from 'clsx'
    import { useState } from 'react'
    
    function Example() {
      const [open, setOpen] = useState(false)
    
      return (
        <div className="relative">
          <button onClick={() => setOpen((open) => !open)}>Toggle</button>
          <Transition show={open}>
            <div
              className={clsx([
                // Base styles
                'absolute w-48 border transition ease-in-out',
                // Shared closed styles
                'data-closed:opacity-0',
                // Entering styles
                'data-enter:duration-100 data-enter:data-closed:-translate-x-full',
                // Leaving styles
                'data-leave:duration-300 data-leave:data-closed:translate-x-full',
              ])}
            >
              I will enter from the left and leave to the right
            </div>
          </Transition>
        </div>
      )
    }

This example combines the `data-enter` and `data-closed` attributes to specify the starting point of the enter transition, and combines the `data-leave` and `data-closed` attributes to specify the ending point of the leave transition.

It also uses the `data-enter` and `data-leave` attributes to specify different enter and leave durations.

### [](#coordinating-multiple-transitions)

Sometimes you need to transition multiple elements with different animations but all based on the same state. For example, say the user clicks a button to open a sidebar that slides over the screen, and you also need to fade-in a backdrop at the same time.

You can do this by wrapping the related elements with a parent `Transition` component, and wrapping each child that needs its own transition styles with a `TransitionChild` component, which will automatically communicate with the parent `Transition` and inherit the parent's `open` state.

    import { Transition, TransitionChild } from '@headlessui/react'
    import { useState } from 'react'
    
    function Example() {
      const [open, setOpen] = useState(false)
    
      return (
        <>
          <button onClick={() => setOpen(true)}>Open</button>
          {/* The `show` prop controls all nested `TransitionChild` components. */}
          <Transition show={open}>        {/* Backdrop */}
            <TransitionChild>          <div
                className="fixed inset-0 bg-black/30 transition duration-300 data-closed:opacity-0"
                onClick={() => setOpen(false)}
              />
            </TransitionChild>
            {/* Slide-in sidebar */}
            <TransitionChild>          <div className="fixed inset-y-0 left-0 w-64 bg-white transition duration-300 data-closed:-translate-x-full">
                {/* ... */}
              </div>        </TransitionChild>      </Transition>
        </>
      )
    }
    

The `TransitionChild` component has the exact same API as the `Transition` component, but with no `show` prop, since the `show` value is controlled by the parent.

Parent `Transition` components will always automatically wait for all children to finish transitioning before unmounting, so you don't need to manage any of that timing yourself.

### [](#transitioning-on-initial-mount)

If you want an element to transition the very first time it's rendered, set the `appear` prop to `true`.

This is useful if you want something to transition in on initial page load, or when its parent is conditionally rendered.

    import { Transition } from '@headlessui/react'
    import { useState } from 'react'
    
    function Example() {
      const [open, setOpen] = useState(true)
    
      return (
        <>
          <button onClick={() => setOpen((open) => !open)}>Toggle</button>
          <Transition show={open} appear={true}>        <div className="transition duration-300 ease-in data-closed:opacity-0">I will fade in on initial render</div>
          </Transition>
        </>
      )
    }
    

[](#component-api)
------------------

### [](#transition)</content>
</page>

<page>
  <title>Headless UI</title>
  <url>https://headlessui.com/react/popover</url>
  <content>Popovers are perfect for floating panels with arbitrary content like navigation menus, mobile menus and flyout menus.

[](#installation)
-----------------

To get started, install Headless UI via npm:

    npm install @headlessui/react

[](#basic-example)
------------------

Popovers are built using the `Popover`, `PopoverButton`, and `PopoverPanel` components.

Clicking the `PopoverButton` will automatically open/close the `PopoverPanel`. When the panel is open, clicking anywhere outside of its contents, pressing the Escape key, or tabbing away from it will close the popover.

    import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
    
    function Example() {
      return (
        <Popover className="relative">
          <PopoverButton>Solutions</PopoverButton>
          <PopoverPanel anchor="bottom" className="flex flex-col">
            <a href="/analytics">Analytics</a>
            <a href="/engagement">Engagement</a>
            <a href="/security">Security</a>
            <a href="/integrations">Integrations</a>
          </PopoverPanel>
        </Popover>
      )
    }

[](#styling)
------------

Headless UI keeps track of a lot of state about each component, like which listbox option is currently selected, whether a popover is open or closed, or which item in a popover is currently focused via the keyboard.

But because the components are headless and completely unstyled out of the box, you can't see this information in your UI until you provide the styles you want for each state yourself.

### [](#using-data-attributes)

The easiest way to style the different states of a Headless UI component is using the `data-*` attributes that each component exposes.

For example, the `Popover` component exposes a `data-open` attribute, which tells you if the popover is currently open.

    <!-- Rendered `Popover` -->
    <div data-open>
      <button data-open>Solutions</button>
      <div data-open>
        <a href="/insights">Insights</a>
        <a href="/automations">Automations</a>
        <a href="/reports">Reports</a>
      </div>
    </div>

Use the [CSS attribute selector](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors) to conditionally apply styles based on the presence of these data attributes. If you're using Tailwind CSS, the [data attribute modifier](https://tailwindcss.com/docs/hover-focus-and-other-states#data-attributes) makes this easy:

    import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
    import { ChevronDownIcon } from '@heroicons/react/20/solid'
    
    function Example() {
      return (
        <Popover className="group">      <PopoverButton className="flex items-center gap-2">
            Solutions
            <ChevronDownIcon className="size-5 group-data-open:rotate-180" />      </PopoverButton>
          <PopoverPanel anchor="bottom" className="flex flex-col">
            <a href="/insights">Insights</a>
            <a href="/automations">Automations</a>
            <a href="/reports">Reports</a>
          </PopoverPanel>
        </Popover>
      )
    }
    

See the [component API](#component-api) for a list of all the available data attributes.

### [](#using-render-props)

Each component also exposes information about its current state via [render props](https://reactjs.org/docs/render-props.html) that you can use to conditionally apply different styles or render different content.

For example, the `Popover` component exposes an `open` state, which tells you if the popover is currently open.

    import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
    import { ChevronDownIcon } from '@heroicons/react/20/solid'
    import clsx from 'clsx'
    
    function Example() {
      return (
        <Popover>
          {({ open }) => (        <>
              <PopoverButton className="flex items-center gap-2">
                Solutions
                <ChevronDownIcon className={clsx('size-5', open && 'rotate-180')} />          </PopoverButton>
              <PopoverPanel anchor="bottom" className="flex flex-col">
                <a href="/insights">Insights</a>
                <a href="/automations">Automations</a>
                <a href="/reports">Reports</a>
              </PopoverPanel>
            </>
          )}    </Popover>
      )
    }
    

See the [component API](#component-api) for a list of all the available render props.

[](#examples)
-------------

When rendering several related popovers, for example in a site's header navigation, use the `PopoverGroup` component. This ensures panels stay open while users are tabbing between popovers within a group, but closes any open panel once the user tabs outside of the group:

    import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
    
    function Example() {
      return (
        <PopoverGroup>      <Popover>
            <PopoverButton>Product</PopoverButton>
            <PopoverPanel>{/* ... */}</PopoverPanel>
          </Popover>
    
          <Popover>
            <PopoverButton>Solutions</PopoverButton>
            <PopoverPanel>{/* ... */}</PopoverPanel>
          </Popover>
    
          <Popover>
            <PopoverButton>Pricing</PopoverButton>
            <PopoverPanel>{/* ... */}</PopoverPanel>
          </Popover>
        </PopoverGroup>  )
    }
    

### [](#setting-the-panel-width)

The `PopoverPanel` has no width set by default, but you can add one using CSS:

    import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
    
    function Example() {
      return (
        <Popover className="relative">
          <PopoverButton>Solutions</PopoverButton>
          <PopoverPanel anchor="bottom" className="w-52">        <a href="/analytics">Analytics</a>
            <a href="/engagement">Engagement</a>
            <a href="/security">Security</a>
            <a href="/integrations">Integrations</a>
          </PopoverPanel>
        </Popover>
      )
    }
    

If you'd like the panel width to match the `PopoverButton` width, use the `--button-width` CSS variable that's exposed on the `PopoverPanel` element:

    import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
    
    function Example() {
      return (
        <Popover className="relative">
          <PopoverButton>Solutions</PopoverButton>
          <PopoverPanel anchor="bottom" className="flex w-(--button-width) flex-col">        <a href="/analytics">Analytics</a>
            <a href="/engagement">Engagement</a>
            <a href="/security">Security</a>
            <a href="/integrations">Integrations</a>
          </PopoverPanel>
        </Popover>
      )
    }
    

### [](#positioning-the-panel)

Add the `anchor` prop to the `PopoverPanel` to automatically position the panel relative to the `PopoverButton`:

    import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
    
    function Example() {
      return (
        <Popover className="relative">
          <PopoverButton>Solutions</PopoverButton>
          <PopoverPanel anchor="bottom start" className="flex flex-col">        <a href="/analytics">Analytics</a>
            <a href="/engagement">Engagement</a>
            <a href="/security">Security</a>
            <a href="/integrations">Integrations</a>
          </PopoverPanel>
        </Popover>
      )
    }
    

Use the values `top`, `right`, `bottom`, or `left` to center the panel along the appropriate edge, or combine it with `start` or `end` to align the panel to a specific corner, such as `top start` or `bottom end`.

To control the gap between the button and the panel, use the `--anchor-gap` CSS variable:

    import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
    
    function Example() {
      return (
        <Popover className="relative">
          <PopoverButton>Solutions</PopoverButton>
          <PopoverPanel anchor="bottom start" className="flex flex-col [--anchor-gap:4px] sm:[--anchor-gap:8px]">        <a href="/analytics">Analytics</a>
            <a href="/engagement">Engagement</a>
            <a href="/security">Security</a>
            <a href="/integrations">Integrations</a>
          </PopoverPanel>
        </Popover>
      )
    }
    

Additionally, you can use `--anchor-offset` to control the distance that the panel should be nudged from its original position, and `--anchor-padding` to control the minimum space that should exist between the panel and the viewport.

The `anchor` prop also supports an object API that allows you to control the `gap`, `offset`, and `padding` values using JavaScript:

    import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
    
    function Example() {
      return (
        <Popover className="relative">
          <PopoverButton>Solutions</PopoverButton>
          <PopoverPanel anchor={{ to: 'bottom start', gap: '4px' }} className="flex flex-col">        <a href="/analytics">Analytics</a>
            <a href="/engagement">Engagement</a>
            <a href="/security">Security</a>
            <a href="/integrations">Integrations</a>
          </PopoverPanel>
        </Popover>
      )
    }
    

See the [PopoverPanel API](#popover-panel) for more information about these options.

### [](#adding-a-backdrop)

If you'd like to style a backdrop over your application UI whenever you open a popover, use the `PopoverBackdrop` component:

    import { Popover, PopoverButton, PopoverBackdrop, PopoverPanel } from '@headlessui/react'
    
    function Example() {
      return (
        <Popover className="relative">
          <PopoverButton>Solutions</PopoverButton>
          <PopoverBackdrop className="fixed inset-0 bg-black/15" />      <PopoverPanel anchor="bottom" className="flex flex-col bg-white">
            <a href="/analytics">Analytics</a>
            <a href="/engagement">Engagement</a>
            <a href="/security">Security</a>
            <a href="/integrations">Integrations</a>
          </PopoverPanel>
        </Popover>
      )
    }
    

In this example, we put the `PopoverBackdrop` before the `Panel` in the DOM so that it doesn't cover up the panel's contents.

But like all the other components, `PopoverBackdrop` is completely headless, so how you style it is up to you.

### [](#adding-transitions)

To animate the opening and closing of the popover panel, add the `transition` prop to the `PopoverPanel` component and then use CSS to style the different stages of the transition:

    import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
    
    function Example() {
      return (
        <Popover>
          <PopoverButton>Solutions</PopoverButton>
          <PopoverPanel
            anchor="bottom"
            transition        className="flex origin-top flex-col transition duration-200 ease-out data-closed:scale-95 data-closed:opacity-0"      >
            <a href="/analytics">Analytics</a>
            <a href="/engagement">Engagement</a>
            <a href="/security">Security</a>
            <a href="/integrations">Integrations</a>
          </PopoverPanel>
        </Popover>
      )
    }
    

If have a backdrop, you can animate it independently of the panel by adding the `transition` prop to the `PopoverBackdrop`:

    import { Popover, PopoverBackdrop, PopoverButton, PopoverPanel } from '@headlessui/react'
    
    function Example() {
      return (
        <Popover className="relative">
          <PopoverButton>Solutions</PopoverButton>
          <PopoverBackdrop
            transition        className="fixed inset-0 bg-black/15 transition duration-100 ease-out data-closed:opacity-0"      />
          <PopoverPanel
            anchor="bottom"
            transition        className="flex origin-top flex-col bg-white transition duration-200 ease-out data-closed:scale-95 data-closed:opacity-0"      >
            <a href="/analytics">Analytics</a>
            <a href="/engagement">Engagement</a>
            <a href="/security">Security</a>
            <a href="/integrations">Integrations</a>
          </PopoverPanel>
        </Popover>
      )
    }
    

Internally, the `transition` prop is implemented in the exact same way as the `Transition` component. See the [Transition documentation](https://headlessui.com/react/transition) to learn more.

### [](#animating-with-framer-motion)

Headless UI also composes well with other animation libraries in the React ecosystem like [Framer Motion](https://www.framer.com/motion/) and [React Spring](https://www.react-spring.io/). You just need to expose some state to those libraries.

For example, to animate the popover with Framer Motion, add the `static` prop to the `PopoverPanel` component and then conditionally render it based on the `open` render prop:

    import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
    import { AnimatePresence, motion } from 'framer-motion'
    
    function Example() {
      return (
        <Popover>
          {({ open }) => (        <>
              <PopoverButton>Solutions</PopoverButton>
              <AnimatePresence>
                {open && (              <PopoverPanel
                    static                as={motion.div}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    anchor="bottom"
                    className="flex origin-top flex-col"
                  >
                    <a href="/analytics">Analytics</a>
                    <a href="/engagement">Engagement</a>
                    <a href="/security">Security</a>
                    <a href="/integrations">Integrations</a>
                  </PopoverPanel>
                )}          </AnimatePresence>
            </>
          )}    </Popover>
      )
    }
    

### [](#closing-popovers-manually)

Since popovers can contain interactive content like form controls, we can't automatically close them when you click something inside of them like we can with `Menu` components.

To close a popover manually when clicking a child of its panel, render that child as a `CloseButton`. You can use the `as` prop to customize which element is being rendered.

    import { CloseButton, Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
    import MyLink from './MyLink'
    
    function Example() {
      return (
        <Popover>
          <PopoverButton>Solutions</PopoverButton>
          <PopoverPanel anchor="bottom">
            <CloseButton as={MyLink} href="/insights">          Insights        </CloseButton>        {/* ... */}
          </PopoverPanel>
        </Popover>
      )
    }
    

The `Popover` and `PopoverPanel` also expose a `close` render prop which you can use to imperatively close the panel, say after running an async action:

    import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
    
    function Example() {
      return (
        <Popover>
          <PopoverButton>Terms</PopoverButton>
          <PopoverPanel>
            {({ close }) => (          <button            onClick={async () => {              await fetch('/accept-terms', { method: 'POST' })              close()            }}          >            Read and accept          </button>        )}      </PopoverPanel>
        </Popover>
      )
    }
    

By default the `PopoverButton` receives focus after calling `close`, but you can change this by passing a ref into `close(ref)`.

Finally, Headless UI also provides a `useClose` hook that can be used to imperatively close the nearest popover ancestor when you don't have easy access to the `close` render prop, such as in a nested component:

    import { Popover, PopoverButton, PopoverPanel, useClose } from '@headlessui/react'
    
    function MySearchForm() {
      let close = useClose()
      return (
        <form
          onSubmit={(event) => {
            event.preventDefault()
            /* Perform search... */
            close()      }}
        >
          <input type="search" />
          <button type="submit">Submit</button>
        </form>
      )
    }
    
    function Example() {
      return (
        <Popover>
          <PopoverButton>Filters</PopoverButton>
          <PopoverPanel>
            <MySearchForm />
            {/* ... */}
          </PopoverPanel>
        </Popover>
      )
    }
    

The `useClose` hook must be used in a component that's nested within the `Popover`, otherwise it will not work.

### [](#rendering-as-different-elements)

By default, the `Popover` and its subcomponents each render a default element that is sensible for that component.

The `Popover`, `PopoverBackdrop`, `PopoverPanel`, and `PopoverGroup` components all render a `<div>`, and the `PopoverButton` component renders a `<button>`.

Use the `as` prop to render the component as a different element or as your own custom component, making sure your custom components [forward refs](https://react.dev/reference/react/forwardRef) so that Headless UI can wire things up correctly.

    import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
    import { forwardRef } from 'react'
    
    let MyCustomButton = forwardRef(function (props, ref) {  return <button className="..." ref={ref} {...props} />})
    function Example() {
      return (
        <Popover as="nav">      <PopoverButton as={MyCustomButton}>Solutions</PopoverButton>      <PopoverPanel as="form">{/* ... */}</PopoverPanel>    </Popover>
      )
    }
    

[](#keyboard-interaction)
-------------------------

[](#component-api)
------------------

### [](#popover)

The main popover component.

### [](#popover-backdrop)

This can be used to create a backdrop for your popover component. Clicking on the backdrop will close the popover.

### [](#popover-button)

This is the trigger component to toggle a popover.

### [](#popover-panel)

This component contains the contents of your popover.

### [](#popover-group)

Link related sibling popovers by wrapping them in a `PopoverGroup`. Tabbing out of one `PopoverPanel` will focus the next popover's `PopoverButton`, and tabbing outside of the `PopoverGroup` completely will close all popovers inside the group.

### [](#close-button)

This button will close the nearest `PopoverPanel` ancestor when clicked. Alternatively, use the `useClose` hook to imperatively close the popover panel.</content>
</page>

<page>
  <title>Headless UI</title>
  <url>https://headlessui.com/react/tabs</url>
  <content>Easily create accessible, fully customizable tab interfaces, with robust focus management and keyboard navigation support.

[](#installation)
-----------------

To get started, install Headless UI via npm:

    npm install @headlessui/react

[](#basic-example)
------------------

Tabs are built using the `TabGroup`, `TabList`, `Tab`, `TabPanels`, and `TabPanel` components. By default the first tab is selected, and clicking on any tab or selecting it with the keyboard will activate the corresponding panel.

    import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
    
    function Example() {
      return (
        <TabGroup>
          <TabList>
            <Tab>Tab 1</Tab>
            <Tab>Tab 2</Tab>
            <Tab>Tab 3</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>Content 1</TabPanel>
            <TabPanel>Content 2</TabPanel>
            <TabPanel>Content 3</TabPanel>
          </TabPanels>
        </TabGroup>
      )
    }

[](#styling)
------------

Headless UI keeps track of a lot of state about each component, like which tab is currently selected, whether a popover is open or closed, or which item in a menu is currently focused via the keyboard.

But because the components are headless and completely unstyled out of the box, you can't see this information in your UI until you provide the styles you want for each state yourself.

### [](#using-data-attributes)

The easiest way to style the different states of a Headless UI component is using the `data-*` attributes that each component exposes.

For example, the `Tab` component exposes a `data-selected` attribute, which tells you if the tab is currently selected, and a `data-hover` attribute, which tells you if the tab is currently being hovered by the mouse.

    <!-- Rendered `TabGroup` -->
    <div>
      <div>
        <button>Tab 1</button>
        <button data-selected>Tab 2</button>
        <button data-hover>Tab 3</button>
      </div>
      <div>
        <div>Content 1</div>
        <div data-selected>Content 2</div>
        <div>Content 3</div>
      </div>
    </div>

Use the [CSS attribute selector](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors) to conditionally apply styles based on the presence of these data attributes. If you're using Tailwind CSS, the [data attribute modifier](https://tailwindcss.com/docs/hover-focus-and-other-states#data-attributes) makes this easy:

    import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
    
    function Example() {
      return (
        <TabGroup>
          <TabList>
            <Tab className="data-hover:underline data-selected:bg-blue-500 data-selected:text-white">Tab 1</Tab>        <Tab className="data-hover:underline data-selected:bg-blue-500 data-selected:text-white">Tab 2</Tab>        <Tab className="data-hover:underline data-selected:bg-blue-500 data-selected:text-white">Tab 3</Tab>      </TabList>
          <TabPanels>
            <TabPanel>Content 1</TabPanel>
            <TabPanel>Content 2</TabPanel>
            <TabPanel>Content 3</TabPanel>
          </TabPanels>
        </TabGroup>
      )
    }
    

See the [component API](#component-api) for a list of all the available data attributes.

### [](#using-render-props)

Each component also exposes information about its current state via [render props](https://reactjs.org/docs/render-props.html) that you can use to conditionally apply different styles or render different content.

For example, the `Tab` component exposes a `selected` state, which tells you if the tab is currently selected, and a `hover` state, which tells you if the tab is currently being hovered by the mouse.

    import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
    import clsx from 'clsx'
    import { Fragment } from 'react'
    
    function Example() {
      return (
        <TabGroup>
          <TabList>
            <Tab as={Fragment}>
              {({ hover, selected }) => (            <button className={clsx(hover && 'underline', selected && 'bg-blue-500 text-white')}>Tab 1</button>          )}        </Tab>
            <Tab as={Fragment}>
              {({ hover, selected }) => (            <button className={clsx(hover && 'underline', selected && 'bg-blue-500 text-white')}>Tab 2</button>          )}        </Tab>
            <Tab as={Fragment}>
              {({ hover, selected }) => (            <button className={clsx(hover && 'underline', selected && 'bg-blue-500 text-white')}>Tab 3</button>          )}        </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>Content 1</TabPanel>
            <TabPanel>Content 2</TabPanel>
            <TabPanel>Content 3</TabPanel>
          </TabPanels>
        </TabGroup>
      )
    }
    

See the [component API](#component-api) for a list of all the available render props.

[](#examples)
-------------

### [](#disabling-a-tab)

Use the `disabled` prop to disable a `Tab` and prevent it from being selected:

    import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
    
    function Example() {
      return (
        <TabGroup>
          <TabList>
            <Tab>Tab 1</Tab>
            <Tab disabled className="disabled:opacity-50">          Tab 2
            </Tab>
            <Tab>Tab 3</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>Content 1</TabPanel>
            <TabPanel>Content 2</TabPanel>
            <TabPanel>Content 3</TabPanel>
          </TabPanels>
        </TabGroup>
      )
    }
    

### [](#displaying-tabs-vertically)

If you've styled your `TabList` to appear vertically, use the `vertical` prop to enable navigating with the up and down arrow keys instead of left and right, and to update the `aria-orientation` attribute for assistive technologies.

    import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
    
    function Example() {
      return (
        <TabGroup vertical>      <TabList className="flex flex-col">
            <Tab>Tab 1</Tab>
            <Tab>Tab 2</Tab>
            <Tab>Tab 3</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>Content 1</TabPanel>
            <TabPanel>Content 2</TabPanel>
            <TabPanel>Content 3</TabPanel>
          </TabPanels>
        </TabGroup>
      )
    }
    

### [](#manually-activating-tabs)

By default, tabs are automatically selected as the user navigates through them using the arrow keys.

If you'd rather not change the current tab until the user presses `Enter` or `Space`, use the `manual` prop on the `TabGroup` component. This can be helpful if selecting a tab performs an expensive operation and you don't want to run it unnecessarily.

    import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
    
    function Example() {
      return (
        <TabGroup manual>      <TabList>
            <Tab>Tab 1</Tab>
            <Tab>Tab 2</Tab>
            <Tab>Tab 3</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>Content 1</TabPanel>
            <TabPanel>Content 2</TabPanel>
            <TabPanel>Content 3</TabPanel>
          </TabPanels>
        </TabGroup>
      )
    }
    

The `manual` prop has no impact on mouse interactions — tabs will still be selected as soon as they are clicked.

### [](#specifying-the-default-tab)

To change which tab is selected by default, use the `defaultIndex={number}` prop on the `TabGroup` component.

    import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
    
    function Example() {
      return (
        <TabGroup defaultIndex={1}>      <TabList>
            <Tab>Tab 1</Tab>
    
            {/* Selects this tab by default */}        <Tab>Tab 2</Tab>
            <Tab>Tab 3</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>Content 1</TabPanel>
    
            {/* Displays this panel by default */}        <TabPanel>Content 2</TabPanel>
            <TabPanel>Content 3</TabPanel>
          </TabPanels>
        </TabGroup>
      )
    }
    

If you happen to provide an index that is out of bounds, then the last non-disabled tab will be selected on initial render. (For example, `<TabGroup defaultIndex={5}>` in the example above would render the third panel as selected.)

### [](#listening-for-changes)

To run a function whenever the selected tab changes, use the `onChange` prop on the `TabGroup` component.

    import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
    
    function Example() {
      return (
        <TabGroup
          onChange={(index) => {        console.log('Changed selected tab to:', index)      }}    >
          <TabList>
            <Tab>Tab 1</Tab>
            <Tab>Tab 2</Tab>
            <Tab>Tab 3</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>Content 1</TabPanel>
            <TabPanel>Content 2</TabPanel>
            <TabPanel>Content 3</TabPanel>
          </TabPanels>
        </TabGroup>
      )
    }
    

### [](#controlling-the-selected-tab)

By default, the tabs component manages the selected tab internally. However, you can control the selected tab yourself using the `selectedIndex` prop and `onChange` callback:

    import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
    import { useState } from 'react'
    
    function Example() {
      const [selectedIndex, setSelectedIndex] = useState(0)
      return (
        <TabGroup selectedIndex={selectedIndex} onChange={setSelectedIndex}>      <TabList>
            <Tab>Tab 1</Tab>
            <Tab>Tab 2</Tab>
            <Tab>Tab 3</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>Content 1</TabPanel>
            <TabPanel>Content 2</TabPanel>
            <TabPanel>Content 3</TabPanel>
          </TabPanels>
        </TabGroup>
      )
    }
    

### [](#rendering-as-different-elements)

By default, the `TabGroup` and its subcomponents each render a default element that is sensible for that component.

For example, `TabGroup` renders a `div`, `TabList` renders a `div`, and `Tab` renders a `button`.

Use the `as` prop to render the component as a different element or as your own custom component, making sure your custom components [forward refs](https://react.dev/reference/react/forwardRef) so that Headless UI can wire things up correctly.

    import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
    import { forwardRef } from 'react'
    
    let MyCustomButton = forwardRef(function (props, ref) {  return <button className="..." ref={ref} {...props} />})
    function Example() {
      return (
        <TabGroup>
          <TabList as="aside">        <Tab as={MyCustomButton}>Tab 1</Tab>
            <Tab as={MyCustomButton}>Tab 2</Tab>
            <Tab as={MyCustomButton}>Tab 3</Tab>
          </TabList>
          <TabPanels as="section">        <TabPanel>Content 1</TabPanel>
            <TabPanel>Content 2</TabPanel>
            <TabPanel>Content 3</TabPanel>
          </TabPanels>
        </TabGroup>
      )
    }
    

To tell an element to render its children directly with no wrapper element, use a `Fragment`.

    import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
    import { Fragment } from 'react'
    
    function Example() {
      return (
        <TabGroup as={Fragment}>      <TabList>
            <Tab>Tab 1</Tab>
            <Tab>Tab 2</Tab>
            <Tab>Tab 3</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>Content 1</TabPanel>
            <TabPanel>Content 2</TabPanel>
            <TabPanel>Content 3</TabPanel>
          </TabPanels>
        </TabGroup>
      )
    }
    

[](#keyboard-interaction)
-------------------------

All interactions apply when a `Tab` component is focused.

[](#component-api)
------------------

### [](#tab-group)

The main TabGroup component.</content>
</page>

<page>
  <title>Headless UI</title>
  <url>https://headlessui.com/react/checkbox</url>
  <content>Checkboxes provide the same functionality as native HTML checkboxes, without any of the styling, giving you a clean slate to design them however you'd like.

[](#installation)
-----------------

To get started, install Headless UI via npm:

    npm install @headlessui/react

[](#basic-example)
------------------

Checkboxes are built using the `Checkbox` component. You can toggle your checkbox by clicking directly on the component, or by pressing the spacebar while it's focused.

Toggling the checkbox calls the `onChange` function with the new `checked` value.

    import { Checkbox } from '@headlessui/react'
    import { useState } from 'react'
    
    function Example() {
      const [enabled, setEnabled] = useState(false)
    
      return (
        <Checkbox
          checked={enabled}
          onChange={setEnabled}
          className="group block size-4 rounded border bg-white data-checked:bg-blue-500"
        >
          {/* Checkmark icon */}
          <svg className="stroke-white opacity-0 group-data-checked:opacity-100" viewBox="0 0 14 14" fill="none">
            <path d="M3 8L6 11L11 3.5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Checkbox>
      )
    }

[](#styling)
------------

Headless UI keeps track of a lot of state about each component, like whether or not a checkbox is checked, whether a popover is open or closed, or which item in a menu is currently focused via the keyboard.

But because the components are headless and completely unstyled out of the box, you can't see this information in your UI until you provide the styles you want for each state yourself.

### [](#using-data-attributes)

The easiest way to style the different states of a Headless UI component is using the `data-*` attributes that each component exposes.

For example, the `Checkbox` component exposes a `data-checked` attribute, which tells you if the checkbox is currently checked, and a `data-disabled` attribute, which tells you if the checkbox is currently disabled.

    <!-- Rendered `Checkbox` -->
    <span role="checkbox" data-checked data-disabled>
      <!-- ... -->
    </span>

Use the [CSS attribute selector](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors) to conditionally apply styles based on the presence of these data attributes. If you're using Tailwind CSS, the [data attribute modifier](https://tailwindcss.com/docs/hover-focus-and-other-states#data-attributes) makes this easy:

    import { Checkbox } from '@headlessui/react'
    import { useState } from 'react'
    
    function Example() {
      const [enabled, setEnabled] = useState(false)
    
      return (
        <Checkbox
          checked={enabled}
          onChange={setEnabled}
          className="group block size-4 rounded border bg-white data-checked:bg-blue-500 data-disabled:cursor-not-allowed data-disabled:opacity-50 data-checked:data-disabled:bg-gray-500"    >
          <svg className="stroke-white opacity-0 group-data-checked:opacity-100" viewBox="0 0 14 14" fill="none">        <path d="M3 8L6 11L11 3.5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Checkbox>
      )
    }
    

See the [component API](#component-api) for a list of all the available data attributes.

### [](#using-render-props)

Each component also exposes information about its current state via [render props](https://reactjs.org/docs/render-props.html) that you can use to conditionally apply different styles or render different content.

For example, the `Checkbox` component exposes a `checked` state, which tells you if the checkbox is currently checked, and a `disabled` state, which tells you if the checkbox is currently disabled.

    import { Checkbox } from '@headlessui/react'
    import clsx from 'clsx'
    import { Fragment, useState } from 'react'
    
    function Example() {
      const [enabled, setEnabled] = useState(false)
    
      return (
        <Checkbox checked={enabled} onChange={setEnabled} as={Fragment}>
          {({ checked, disabled }) => (        <span
              className={clsx(
                'block size-4 rounded border',
                !checked && 'bg-white',            checked && !disabled && 'bg-blue-500',            checked && disabled && 'bg-gray-500',            disabled && 'cursor-not-allowed opacity-50'          )}
            >
              <svg className={clsx('stroke-white', checked ? 'opacity-100' : 'opacity-0')} viewBox="0 0 14 14" fill="none">            <path d="M3 8L6 11L11 3.5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          )}    </Checkbox>
      )
    }
    

See the [component API](#component-api) for a list of all the available render props.

[](#examples)
-------------

### [](#adding-a-label)

Wrap a `Label` and `Checkbox` with the `Field` component to automatically associate them using a generated ID:

    import { useState } from 'react'
    import { Checkbox, Field, Label } from '@headlessui/react'
    function Example() {
      const [enabled, setEnabled] = useState(false)
    
      return (
        <Field className="flex items-center gap-2">      <Checkbox
            checked={enabled}
            onChange={setEnabled}
            className="group block size-4 rounded border bg-white data-checked:bg-blue-500"
          >
            <svg className="stroke-white opacity-0 group-data-checked:opacity-100" viewBox="0 0 14 14" fill="none">
              <path d="M3 8L6 11L11 3.5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Checkbox>
          <Label>Enable beta features</Label>    </Field>  )
    }
    

By default, clicking the `Label` will toggle the `Checkbox`, just like labels do for native HTML checkboxes. If you'd like to make the `Label` non-clickable, you can add a `passive` prop to the `Label` component:

    <Label passive>Enable beta features</Label>

### [](#adding-a-description)

Use the `Description` component within a `Field` to automatically associate it with a `Checkbox` using the `aria-describedby` attribute:

    import { Checkbox, Description, Field, Label } from '@headlessui/react'
    import { useState } from 'react'
    
    function Example() {
      const [enabled, setEnabled] = useState(false)
    
      return (
        <Field>      <Label>Enable beta features</Label>
          <Description>This will give you early access to new features we're developing.</Description>      <Checkbox
            checked={enabled}
            onChange={setEnabled}
            className="group block size-4 rounded border bg-white data-checked:bg-blue-500"
          >
            <svg className="stroke-white opacity-0 group-data-checked:opacity-100" viewBox="0 0 14 14" fill="none">
              <path d="M3 8L6 11L11 3.5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Checkbox>
        </Field>  )
    }
    

### [](#disabling-a-checkbox)

Add the `disabled` prop to the `Field` component to disable a `Checkbox` and its associated `Label` and `Description`:

    import { Checkbox, Description, Field, Label } from '@headlessui/react'
    import { useState } from 'react'
    
    function Example() {
      const [enabled, setEnabled] = useState(false)
    
      return (
        <Field disabled>      <Label className="data-disabled:opacity-50">Enable beta features</Label>
          <Description className="data-disabled:opacity-50">
            This will give you early access to new features we're developing.
          </Description>
          <Checkbox
            checked={enabled}
            onChange={setEnabled}
            className="group block size-4 rounded border bg-white data-checked:bg-blue-500 data-disabled:cursor-not-allowed data-disabled:opacity-50 data-checked:data-disabled:bg-gray-500"
          >
            <svg className="stroke-white opacity-0 group-data-checked:opacity-100" viewBox="0 0 14 14" fill="none">
              <path d="M3 8L6 11L11 3.5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Checkbox>
        </Field>
      )
    }
    

You can also disable a checkbox outside of a `Field` by adding the disabled prop directly to the `Checkbox` itself.

### [](#using-with-html-forms)

If you add the `name` prop to your `Checkbox`, a hidden `input` element will be rendered and kept in sync with the checkbox state.

    import { Checkbox } from '@headlessui/react'
    import { useState } from 'react'
    
    function Example() {
      const [enabled, setEnabled] = useState(false)
    
      return (
        <form action="/accounts" method="post">
          <Checkbox
            checked={enabled}
            onChange={setEnabled}
            name="terms-of-service"        className="group block size-4 rounded border bg-white data-checked:bg-blue-500"
          >
            <svg className="stroke-white opacity-0 group-data-checked:opacity-100" viewBox="0 0 14 14" fill="none">
              <path d="M3 8L6 11L11 3.5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Checkbox>
          <button>Submit</button>
        </form>
      )
    }
    

This lets you use a checkbox inside a native HTML `<form>` and make traditional form submissions as if your checkbox was a native HTML form control.

By default, the value will be `on` when the checkbox is checked, and not present when the checkbox is unchecked.

    <!-- Rendered hidden input -->
    <input type="hidden" name="terms-of-service" value="on" />

You can customize the value if needed by using the `value` prop:

    import { Checkbox } from '@headlessui/react'
    import { useState } from 'react'
    
    function Example() {
      const [enabled, setEnabled] = useState(false)
    
      return (
        <form action="/accounts" method="post">
          <Checkbox
            checked={enabled}
            onChange={setEnabled}
            name="terms-of-service"
            value="accept"        className="group block size-4 rounded border bg-white data-checked:bg-blue-500"
          >
            <svg className="stroke-white opacity-0 group-data-checked:opacity-100" viewBox="0 0 14 14" fill="none">
              <path d="M3 8L6 11L11 3.5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Checkbox>
          <button>Submit</button>
        </form>
      )
    }
    

The hidden input will then use your custom value when the checkbox is checked:

    <!-- Rendered hidden input -->
    <input type="hidden" name="terms-of-service" value="accept" />

Basic values like strings will be rendered as a single hidden input containing that value, but complex values like objects will be encoded into multiple inputs using a square bracket notation for the names.

### [](#using-as-uncontrolled)

If you omit the `checked` prop, Headless UI will track its state internally for you, allowing you to use it as an [uncontrolled component](https://reactjs.org/docs/uncontrolled-components.html).

When uncontrolled, you can check the `Checkbox` by default using the `defaultChecked` prop.

    import { Checkbox } from '@headlessui/react'
    
    function Example() {
      return (
        <form action="/accounts" method="post">
          <Checkbox
            defaultChecked={true}        name="terms-of-service"
            className="group block size-4 rounded border bg-white data-checked:bg-blue-500"
          >
            <svg className="stroke-white opacity-0 group-data-checked:opacity-100" viewBox="0 0 14 14" fill="none">
              <path d="M3 8L6 11L11 3.5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Checkbox>
          <button>Submit</button>
        </form>
      )
    }
    

This can simplify your code when using the checkbox [with HTML forms](#using-with-html-forms) or with form APIs that collect their state using [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData) instead of tracking it using React state.

Any `onChange` prop you provide will still be called when the component's value changes in case you need to run any side effects, but you won't need to use it to track the component's state yourself.

### [](#adding-transitions)

Because checkboxes are typically always rendered to the DOM (rather than being mounted/unmounted like other components), simple CSS transitions are often enough to animate your checkbox:

    import { Checkbox } from '@headlessui/react'
    import { useState } from 'react'
    
    function Example() {
      const [enabled, setEnabled] = useState(false)
    
      return (
        <Checkbox
          checked={enabled}
          onChange={setEnabled}
          className="group block size-4 rounded border bg-white transition data-checked:bg-blue-500"    >
          <svg className="stroke-white opacity-0 transition group-data-checked:opacity-100" viewBox="0 0 14 14" fill="none">
            <path d="M3 8L6 11L11 3.5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />      </svg>
        </Checkbox>
      )
    }
    

Because they're renderless, Headless UI components also compose well with other animation libraries in the React ecosystem like [Framer Motion](https://www.framer.com/motion/) and [React Spring](https://www.react-spring.io/).

### [](#rendering-as-different-element)

The `Checkbox` component renders a `span` by default. Use the `as` prop to render the component as a different element or as your own custom component.

    import { Checkbox } from '@headlessui/react'
    import { useState } from 'react'
    
    function Example() {
      const [enabled, setEnabled] = useState(false)
    
      return (
        <Checkbox
          as="div"      checked={enabled}
          onChange={setEnabled}
          className="group block size-4 rounded border bg-white data-checked:bg-blue-500"
        >
          <svg className="stroke-white opacity-0 group-data-checked:opacity-100" viewBox="0 0 14 14" fill="none">
            <path d="M3 8L6 11L11 3.5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Checkbox>
      )
    }
    

[](#keyboard-interaction)
-------------------------

Groups a `Label`, `Description`, and form control together.

The `Label` component labels a form control.

The `Description` component describes a form control.</content>
</page>

<page>
  <title>Headless UI</title>
  <url>https://headlessui.com/react/combobox</url>
  <content>Comboboxes are the foundation of accessible autocompletes and command palettes for your app, complete with robust support for keyboard navigation.

[](#installation)
-----------------

To get started, install Headless UI via npm:

    npm install @headlessui/react

[](#basic-example)
------------------

Comboboxes are built using the `Combobox`, `ComboboxInput`, `ComboboxButton`, `ComboboxOptions`, and `ComboboxOption` components.

You are completely in charge of how you filter the results, whether it be with a fuzzy search library client-side or by making server-side requests to an API. In this example we will keep the logic simple for demo purposes.

    import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
    import { useState } from 'react'
    
    const people = [
      { id: 1, name: 'Durward Reynolds' },
      { id: 2, name: 'Kenton Towne' },
      { id: 3, name: 'Therese Wunsch' },
      { id: 4, name: 'Benedict Kessler' },
      { id: 5, name: 'Katelyn Rohan' },
    ]
    
    function Example() {
      const [selectedPerson, setSelectedPerson] = useState(people[0])
      const [query, setQuery] = useState('')
    
      const filteredPeople =
        query === ''
          ? people
          : people.filter((person) => {
              return person.name.toLowerCase().includes(query.toLowerCase())
            })
    
      return (
        <Combobox value={selectedPerson} onChange={setSelectedPerson} onClose={() => setQuery('')}>
          <ComboboxInput
            aria-label="Assignee"
            displayValue={(person) => person?.name}
            onChange={(event) => setQuery(event.target.value)}
          />
          <ComboboxOptions anchor="bottom" className="border empty:invisible">
            {filteredPeople.map((person) => (
              <ComboboxOption key={person.id} value={person} className="data-focus:bg-blue-100">
                {person.name}
              </ComboboxOption>
            ))}
          </ComboboxOptions>
        </Combobox>
      )
    }

[](#styling)
------------

Headless UI keeps track of a lot of state about each component, like which combobox option is currently selected, whether a popover is open or closed, or which item in a menu is currently focused via the keyboard.

But because the components are headless and completely unstyled out of the box, you can't see this information in your UI until you provide the styles you want for each state yourself.

### [](#using-data-attributes)

The easiest way to style the different states of a Headless UI component is using the `data-*` attributes that each component exposes.

For example, the `ComboboxOption` component exposes a `data-focus` attribute, which tells you if the option is currently focused via the mouse or keyboard, and a `data-selected` attribute, which tells you if that option matches the current `value` of the `Combobox`.

    <!-- Rendered `ComboboxOptions` -->
    <div data-open>
      <div>Wade Cooper</div>
      <div data-focus data-selected>Arlene Mccoy</div>
      <div>Devon Webb</div>
    </div>

Use the [CSS attribute selector](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors) to conditionally apply styles based on the presence of these data attributes. If you're using Tailwind CSS, the [data attribute modifier](https://tailwindcss.com/docs/hover-focus-and-other-states#data-attributes) makes this easy:

    import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
    import { CheckIcon } from '@heroicons/react/20/solid'
    import { useState } from 'react'
    
    const people = [
      { id: 1, name: 'Durward Reynolds' },
      { id: 2, name: 'Kenton Towne' },
      { id: 3, name: 'Therese Wunsch' },
      { id: 4, name: 'Benedict Kessler' },
      { id: 5, name: 'Katelyn Rohan' },
    ]
    
    function Example() {
      const [selectedPerson, setSelectedPerson] = useState(people[0])
      const [query, setQuery] = useState('')
    
      const filteredPeople =
        query === ''
          ? people
          : people.filter((person) => {
              return person.name.toLowerCase().includes(query.toLowerCase())
            })
    
      return (
        <Combobox value={selectedPerson} onChange={setSelectedPerson} onClose={() => setQuery('')}>
          <ComboboxInput
            aria-label="Assignee"
            displayValue={(person) => person?.name}
            onChange={(event) => setQuery(event.target.value)}
          />
          <ComboboxOptions anchor="bottom" className="border empty:invisible">
            {filteredPeople.map((person) => (
              <ComboboxOption key={person.id} value={person} className="group flex gap-2 bg-white data-focus:bg-blue-100">            <CheckIcon className="invisible size-5 group-data-selected:visible" />            {person.name}
              </ComboboxOption>
            ))}
          </ComboboxOptions>
        </Combobox>
      )
    }
    

See the [component API](#component-api) for a list of all the available data attributes.

### [](#using-render-props)

Each component also exposes information about its current state via [render props](https://reactjs.org/docs/render-props.html) that you can use to conditionally apply different styles or render different content.

For example, the `ComboboxOption` component exposes a `focus` state, which tells you if the option is currently focused via the mouse or keyboard, and a `selected` state, which tells you if that option matches the current `value` of the `Combobox`.

    import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
    import { CheckIcon } from '@heroicons/react/20/solid'
    import clsx from 'clsx'
    import { Fragment, useState } from 'react'
    
    const people = [
      { id: 1, name: 'Durward Reynolds' },
      { id: 2, name: 'Kenton Towne' },
      { id: 3, name: 'Therese Wunsch' },
      { id: 4, name: 'Benedict Kessler' },
      { id: 5, name: 'Katelyn Rohan' },
    ]
    
    function Example() {
      const [selectedPerson, setSelectedPerson] = useState(people[0])
      const [query, setQuery] = useState('')
    
      const filteredPeople =
        query === ''
          ? people
          : people.filter((person) => {
              return person.name.toLowerCase().includes(query.toLowerCase())
            })
    
      return (
        <Combobox value={selectedPerson} onChange={setSelectedPerson} onClose={() => setQuery('')}>
          <ComboboxInput
            aria-label="Assignee"
            displayValue={(person) => person?.name}
            onChange={(event) => setQuery(event.target.value)}
          />
          <ComboboxOptions anchor="bottom" className="border empty:invisible">
            {filteredPeople.map((person) => (
              <ComboboxOption as={Fragment} key={person.id} value={person} className="data-focus:bg-blue-100">            {({ focus, selected }) => (              <div className={clsx('group flex gap-2', focus && 'bg-blue-100')}>                {selected && <CheckIcon className="size-5" />}                {person.name}              </div>            )}          </ComboboxOption>        ))}
          </ComboboxOptions>
        </Combobox>
      )
    }
    

See the [component API](#component-api) for a list of all the available render props.

[](#examples)
-------------

### [](#adding-a-label)

Wrap a `Label` and `Combobox` with the `Field` component to automatically associate them using a generated ID:

    import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions, Field, Label } from '@headlessui/react'
    import { useState } from 'react'
    
    const people = [
      { id: 1, name: 'Durward Reynolds' },
      { id: 2, name: 'Kenton Towne' },
      { id: 3, name: 'Therese Wunsch' },
      { id: 4, name: 'Benedict Kessler' },
      { id: 5, name: 'Katelyn Rohan' },
    ]
    
    function Example() {
      const [selectedPerson, setSelectedPerson] = useState(people[0])
      const [query, setQuery] = useState('')
    
      const filteredPeople =
        query === ''
          ? people
          : people.filter((person) => {
              return person.name.toLowerCase().includes(query.toLowerCase())
            })
    
      return (
        <Field>      <Label>Assignee:</Label>      <Combobox value={selectedPerson} onChange={setSelectedPerson} onClose={() => setQuery('')}>
            <ComboboxInput displayValue={(person) => person?.name} onChange={(event) => setQuery(event.target.value)} />
            <ComboboxOptions anchor="bottom" className="border empty:invisible">
              {filteredPeople.map((person) => (
                <ComboboxOption key={person.id} value={person} className="data-focus:bg-blue-100">
                  {person.name}
                </ComboboxOption>
              ))}
            </ComboboxOptions>
          </Combobox>
        </Field>  )
    }
    

### [](#adding-a-description)

Use the `Description` component within a `Field` to automatically associate it with a `Combobox` using the `aria-describedby` attribute:

    import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions, Description, Field, Label } from '@headlessui/react'
    import { useState } from 'react'
    
    const people = [
      { id: 1, name: 'Durward Reynolds' },
      { id: 2, name: 'Kenton Towne' },
      { id: 3, name: 'Therese Wunsch' },
      { id: 4, name: 'Benedict Kessler' },
      { id: 5, name: 'Katelyn Rohan' },
    ]
    
    function Example() {
      const [selectedPerson, setSelectedPerson] = useState(people[0])
      const [query, setQuery] = useState('')
    
      const filteredPeople =
        query === ''
          ? people
          : people.filter((person) => {
              return person.name.toLowerCase().includes(query.toLowerCase())
            })
    
      return (
        <Field>      <Label>Assignee:</Label>
          <Description>This person will have full access to this project.</Description>      <Combobox value={selectedPerson} onChange={setSelectedPerson} onClose={() => setQuery('')}>
            <ComboboxInput displayValue={(person) => person?.name} onChange={(event) => setQuery(event.target.value)} />
            <ComboboxOptions anchor="bottom" className="border empty:invisible">
              {filteredPeople.map((person) => (
                <ComboboxOption key={person.id} value={person} className="data-focus:bg-blue-100">
                  {person.name}
                </ComboboxOption>
              ))}
            </ComboboxOptions>
          </Combobox>
        </Field>  )
    }
    

### [](#disabling-a-combobox)

Add the `disabled` prop to the `Field` component to disable a `Combobox` and its associated `Label` and `Description`:

    import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions, Field, Label } from '@headlessui/react'
    import { useState } from 'react'
    
    const people = [
      { id: 1, name: 'Durward Reynolds' },
      { id: 2, name: 'Kenton Towne' },
      { id: 3, name: 'Therese Wunsch' },
      { id: 4, name: 'Benedict Kessler' },
      { id: 5, name: 'Katelyn Rohan' },
    ]
    
    function Example() {
      const [selectedPerson, setSelectedPerson] = useState(people[0])
      const [query, setQuery] = useState('')
    
      const filteredPeople =
        query === ''
          ? people
          : people.filter((person) => {
              return person.name.toLowerCase().includes(query.toLowerCase())
            })
    
      return (
        <Field disabled>      <Label>Assignee:</Label>
          <Combobox value={selectedPerson} onChange={setSelectedPerson} onClose={() => setQuery('')}>
            <ComboboxInput displayValue={(person) => person?.name} onChange={(event) => setQuery(event.target.value)} />
            <ComboboxOptions anchor="bottom" className="border empty:invisible">
              {filteredPeople.map((person) => (
                <ComboboxOption key={person.id} value={person} className="data-focus:bg-blue-100">
                  {person.name}
                </ComboboxOption>
              ))}
            </ComboboxOptions>
          </Combobox>
        </Field>
      )
    }
    

You can also disable a combobox outside of a `Field` by adding the disabled prop directly to the `Combobox` itself.

### [](#disabling-a-combobox-option)

Use the `disabled` prop to disable a `ComboboxOption` and prevent it from being selected:

    import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
    import { useState } from 'react'
    
    const people = [
      { id: 1, name: 'Durward Reynolds', available: true },
      { id: 2, name: 'Kenton Towne', available: true },
      { id: 3, name: 'Therese Wunsch', available: true },
      { id: 4, name: 'Benedict Kessler', available: false },  { id: 5, name: 'Katelyn Rohan', available: true },
    ]
    
    function Example() {
      const [selectedPerson, setSelectedPerson] = useState(people[0])
      const [query, setQuery] = useState('')
    
      const filteredPeople =
        query === ''
          ? people
          : people.filter((person) => {
              return person.name.toLowerCase().includes(query.toLowerCase())
            })
    
      return (
        <Combobox value={selectedPerson} onChange={setSelectedPerson} onClose={() => setQuery('')}>
          <ComboboxInput
            aria-label="Assignee"
            displayValue={(person) => person?.name}
            onChange={(event) => setQuery(event.target.value)}
          />
          <ComboboxOptions anchor="bottom" className="border empty:invisible">
            {filteredPeople.map((person) => (
              <ComboboxOption
                key={person.id}
                value={person}
                disabled={!person.available}            className="data-disabled:opacity-50 data-focus:bg-blue-100"          >
                {person.name}
              </ComboboxOption>
            ))}
          </ComboboxOptions>
        </Combobox>
      )
    }
    

### [](#allowing-custom-values)

You can allow users to enter their own value that doesn't exist in the list by including a dynamic `ComboboxOption` based on the `query` value.

    import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
    import { useState } from 'react'
    
    const people = [
      { id: 1, name: 'Durward Reynolds' },
      { id: 2, name: 'Kenton Towne' },
      { id: 3, name: 'Therese Wunsch' },
      { id: 4, name: 'Benedict Kessler' },
      { id: 5, name: 'Katelyn Rohan' },
    ]
    
    function Example() {
      const [selectedPerson, setSelectedPerson] = useState(people[0])
      const [query, setQuery] = useState('')
    
      const filteredPeople =
        query === ''
          ? people
          : people.filter((person) => {
              return person.name.toLowerCase().includes(query.toLowerCase())
            })
    
      return (
        <Combobox value={selectedPerson} onChange={setSelectedPerson} onClose={() => setQuery('')}>
          <ComboboxInput
            aria-label="Assignee"
            displayValue={(person) => person?.name}
            onChange={(event) => setQuery(event.target.value)}
          />
          <ComboboxOptions anchor="bottom" className="border empty:invisible">
            {query.length > 0 && (          <ComboboxOption value={{ id: null, name: query }} className="data-focus:bg-blue-100">            Create <span className="font-bold">"{query}"</span>          </ComboboxOption>        )}        {filteredPeople.map((person) => (
              <ComboboxOption key={person.id} value={person} className="data-focus:bg-blue-100">
                {person.name}
              </ComboboxOption>
            ))}
          </ComboboxOptions>
        </Combobox>
      )
    }
    

### [](#using-with-html-forms)

If you add the `name` prop to your `Combobox`, a hidden `input` element will be rendered and kept in sync with the combobox state.

    import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
    import { useState } from 'react'
    
    const people = [
      { id: 1, name: 'Durward Reynolds' },
      { id: 2, name: 'Kenton Towne' },
      { id: 3, name: 'Therese Wunsch' },
      { id: 4, name: 'Benedict Kessler' },
      { id: 5, name: 'Katelyn Rohan' },
    ]
    
    function Example() {
      const [selectedPerson, setSelectedPerson] = useState(people[0])
      const [query, setQuery] = useState('')
    
      const filteredPeople =
        query === ''
          ? people
          : people.filter((person) => {
              return person.name.toLowerCase().includes(query.toLowerCase())
            })
    
      return (
        <form action="/projects/1/assignee" method="post">
          <Combobox name="assignee" value={selectedPerson} onChange={setSelectedPerson} onClose={() => setQuery('')}>        <ComboboxInput
              aria-label="Assignee"
              displayValue={(person) => person?.name}
              onChange={(event) => setQuery(event.target.value)}
            />
            <ComboboxOptions anchor="bottom" className="border empty:invisible">
              {filteredPeople.map((person) => (
                <ComboboxOption key={person.id} value={person} className="data-focus:bg-blue-100">
                  {person.name}
                </ComboboxOption>
              ))}
            </ComboboxOptions>
          </Combobox>
          <button>Submit</button>
        </form>
      )
    }
    

This lets you use a combobox inside a native HTML `<form>` and make traditional form submissions as if your combobox was a native HTML form control.

Basic values like strings will be rendered as a single hidden input containing that value, but complex values like objects will be encoded into multiple inputs using a square bracket notation for the names:

    <!-- Rendered hidden inputs -->
    <input type="hidden" name="assignee[id]" value="1" />
    <input type="hidden" name="assignee[name]" value="Durward Reynolds" />

### [](#using-as-uncontrolled)

If you omit the `value` prop, Headless UI will track its state internally for you, allowing you to use it as an [uncontrolled component](https://reactjs.org/docs/uncontrolled-components.html).

When uncontrolled, use the `defaultValue` prop to provide an initial value to the `Combobox`.

    import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
    import { useState } from 'react'
    
    const people = [
      { id: 1, name: 'Durward Reynolds' },
      { id: 2, name: 'Kenton Towne' },
      { id: 3, name: 'Therese Wunsch' },
      { id: 4, name: 'Benedict Kessler' },
      { id: 5, name: 'Katelyn Rohan' },
    ]
    
    function Example() {
      const [query, setQuery] = useState('')
    
      const filteredPeople =
        query === ''
          ? people
          : people.filter((person) => {
              return person.name.toLowerCase().includes(query.toLowerCase())
            })
    
      return (
        <form action="/projects/1/assignee" method="post">
          <Combobox name="assignee" defaultValue={people[0]} onClose={() => setQuery('')}>        <ComboboxInput
              aria-label="Assignee"
              displayValue={(person) => person?.name}
              onChange={(event) => setQuery(event.target.value)}
            />
            <ComboboxOptions anchor="bottom" className="border empty:invisible">
              {filteredPeople.map((person) => (
                <ComboboxOption key={person.id} value={person} className="data-focus:bg-blue-100">
                  {person.name}
                </ComboboxOption>
              ))}
            </ComboboxOptions>
          </Combobox>
          <button>Submit</button>
        </form>
      )
    }
    

This can simplify your code when using the combobox [with HTML forms](#using-with-html-forms) or with form APIs that collect their state using [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData) instead of tracking it using React state.

Any `onChange` prop you provide will still be called when the component's value changes in case you need to run any side effects, but you won't need to use it to track the component's state yourself.

### [](#positioning-the-dropdown)

Add the `anchor` prop to the `ComboboxOptions` to automatically position the dropdown relative to the `ComboboxInput`:

    import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
    import { useState } from 'react'
    
    const people = [
      { id: 1, name: 'Durward Reynolds' },
      { id: 2, name: 'Kenton Towne' },
      { id: 3, name: 'Therese Wunsch' },
      { id: 4, name: 'Benedict Kessler' },
      { id: 5, name: 'Katelyn Rohan' },
    ]
    
    function Example() {
      const [selectedPerson, setSelectedPerson] = useState(people[0])
      const [query, setQuery] = useState('')
    
      const filteredPeople =
        query === ''
          ? people
          : people.filter((person) => {
              return person.name.toLowerCase().includes(query.toLowerCase())
            })
    
      return (
        <Combobox value={selectedPerson} onChange={setSelectedPerson} onClose={() => setQuery('')}>
          <ComboboxInput
            aria-label="Assignee"
            displayValue={(person) => person?.name}
            onChange={(event) => setQuery(event.target.value)}
          />
          <ComboboxOptions anchor="bottom start" className="border empty:invisible">        {filteredPeople.map((person) => (
              <ComboboxOption key={person.id} value={person} className="data-focus:bg-blue-100">
                {person.name}
              </ComboboxOption>
            ))}
          </ComboboxOptions>
        </Combobox>
      )
    }
    

Use the values `top`, `right`, `bottom`, or `left` to center the dropdown along the appropriate edge, or combine it with `start` or `end` to align the dropdown to a specific corner, such as `top start` or `bottom end`.

To control the gap between the input and the dropdown, use the `--anchor-gap` CSS variable:

    import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
    import { useState } from 'react'
    
    const people = [
      { id: 1, name: 'Durward Reynolds' },
      { id: 2, name: 'Kenton Towne' },
      { id: 3, name: 'Therese Wunsch' },
      { id: 4, name: 'Benedict Kessler' },
      { id: 5, name: 'Katelyn Rohan' },
    ]
    
    function Example() {
      const [selectedPerson, setSelectedPerson] = useState(people[0])
      const [query, setQuery] = useState('')
    
      const filteredPeople =
        query === ''
          ? people
          : people.filter((person) => {
              return person.name.toLowerCase().includes(query.toLowerCase())
            })
    
      return (
        <Combobox value={selectedPerson} onChange={setSelectedPerson} onClose={() => setQuery('')}>
          <ComboboxInput
            aria-label="Assignee"
            displayValue={(person) => person?.name}
            onChange={(event) => setQuery(event.target.value)}
          />
          <ComboboxOptions        anchor="bottom start"
            className="border [--anchor-gap:4px] empty:invisible sm:[--anchor-gap:8px]"
          >
            {filteredPeople.map((person) => (
              <ComboboxOption key={person.id} value={person} className="data-focus:bg-blue-100">
                {person.name}
              </ComboboxOption>
            ))}
          </ComboboxOptions>
        </Combobox>
      )
    }
    

Additionally, you can use `--anchor-offset` to control the distance that the dropdown should be nudged from its original position, and `--anchor-padding` to control the minimum space that should exist between the dropdown and the viewport.

The `anchor` prop also supports an object API that allows you to control the `gap`, `offset`, and `padding` values using JavaScript:

    import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
    import { useState } from 'react'
    
    const people = [
      { id: 1, name: 'Durward Reynolds' },
      { id: 2, name: 'Kenton Towne' },
      { id: 3, name: 'Therese Wunsch' },
      { id: 4, name: 'Benedict Kessler' },
      { id: 5, name: 'Katelyn Rohan' },
    ]
    
    function Example() {
      const [selectedPerson, setSelectedPerson] = useState(people[0])
      const [query, setQuery] = useState('')
    
      const filteredPeople =
        query === ''
          ? people
          : people.filter((person) => {
              return person.name.toLowerCase().includes(query.toLowerCase())
            })
    
      return (
        <Combobox value={selectedPerson} onChange={setSelectedPerson} onClose={() => setQuery('')}>
          <ComboboxInput
            aria-label="Assignee"
            displayValue={(person) => person?.name}
            onChange={(event) => setQuery(event.target.value)}
          />
          <ComboboxOptions anchor={{ to: 'bottom start', gap: '4px' }} className="border empty:invisible">        {filteredPeople.map((person) => (
              <ComboboxOption key={person.id} value={person} className="data-focus:bg-blue-100">
                {person.name}
              </ComboboxOption>
            ))}
          </ComboboxOptions>
        </Combobox>
      )
    }
    

See the [ComboboxOptions API](#combobox-options) for more information about these options.

### [](#setting-the-dropdown-width)

The `ComboboxOptions` dropdown has no width set by default, but you can add one using CSS:

    import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
    import { useState } from 'react'
    
    const people = [
      { id: 1, name: 'Durward Reynolds' },
      { id: 2, name: 'Kenton Towne' },
      { id: 3, name: 'Therese Wunsch' },
      { id: 4, name: 'Benedict Kessler' },
      { id: 5, name: 'Katelyn Rohan' },
    ]
    
    function Example() {
      const [selectedPerson, setSelectedPerson] = useState(people[0])
      const [query, setQuery] = useState('')
    
      const filteredPeople =
        query === ''
          ? people
          : people.filter((person) => {
              return person.name.toLowerCase().includes(query.toLowerCase())
            })
    
      return (
        <Combobox value={selectedPerson} onChange={setSelectedPerson} onClose={() => setQuery('')}>
          <ComboboxInput
            aria-label="Assignee"
            displayValue={(person) => person?.name}
            onChange={(event) => setQuery(event.target.value)}
          />
          <ComboboxOptions anchor="bottom" className="w-52 border empty:invisible">        {filteredPeople.map((person) => (
              <ComboboxOption key={person.id} value={person} className="data-focus:bg-blue-100">
                {person.name}
              </ComboboxOption>
            ))}
          </ComboboxOptions>
        </Combobox>
      )
    }
    

If you'd like the dropdown width to match the `ComboboxInput` or `ComboboxButton` widths, use the `--input-width` and `--button-width` CSS variables that are exposed on the `ComboboxOptions` element:

    import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
    import { useState } from 'react'
    
    const people = [
      { id: 1, name: 'Durward Reynolds' },
      { id: 2, name: 'Kenton Towne' },
      { id: 3, name: 'Therese Wunsch' },
      { id: 4, name: 'Benedict Kessler' },
      { id: 5, name: 'Katelyn Rohan' },
    ]
    
    function Example() {
      const [selectedPerson, setSelectedPerson] = useState(people[0])
      const [query, setQuery] = useState('')
    
      const filteredPeople =
        query === ''
          ? people
          : people.filter((person) => {
              return person.name.toLowerCase().includes(query.toLowerCase())
            })
    
      return (
        <Combobox value={selectedPerson} onChange={setSelectedPerson} onClose={() => setQuery('')}>
          <ComboboxInput
            aria-label="Assignee"
            displayValue={(person) => person?.name}
            onChange={(event) => setQuery(event.target.value)}
          />
          <ComboboxOptions anchor="bottom" className="w-(--input-width) border empty:invisible">        {filteredPeople.map((person) => (
              <ComboboxOption key={person.id} value={person} className="data-focus:bg-blue-100">
                {person.name}
              </ComboboxOption>
            ))}
          </ComboboxOptions>
        </Combobox>
      )
    }
    

### [](#adding-transitions)

To animate the opening and closing of the combobox panel, add the `transition` prop to the `ComboboxOptions` component and then use CSS to style the different stages of the transition:

    import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
    import { useState } from 'react'
    
    const people = [
      { id: 1, name: 'Durward Reynolds' },
      { id: 2, name: 'Kenton Towne' },
      { id: 3, name: 'Therese Wunsch' },
      { id: 4, name: 'Benedict Kessler' },
      { id: 5, name: 'Katelyn Rohan' },
    ]
    
    function Example() {
      const [selectedPerson, setSelectedPerson] = useState(people[0])
      const [query, setQuery] = useState('')
    
      const filteredPeople =
        query === ''
          ? people
          : people.filter((person) => {
              return person.name.toLowerCase().includes(query.toLowerCase())
            })
    
      return (
        <Combobox value={selectedPerson} onChange={setSelectedPerson} onClose={() => setQuery('')}>
          <ComboboxInput
            aria-label="Assignee"
            displayValue={(person) => person?.name}
            onChange={(event) => setQuery(event.target.value)}
          />
          <ComboboxOptions
            anchor="bottom"
            transition        className="origin-top border transition duration-200 ease-out empty:invisible data-closed:scale-95 data-closed:opacity-0"      >
            {filteredPeople.map((person) => (
              <ComboboxOption key={person.id} value={person} className="data-focus:bg-blue-100">
                {person.name}
              </ComboboxOption>
            ))}
          </ComboboxOptions>
        </Combobox>
      )
    }
    

Internally, the `transition` prop is implemented in the exact same way as the `Transition` component. See the [Transition documentation](https://headlessui.com/react/transition) to learn more.

### [](#animating-with-framer-motion)

Headless UI also composes well with other animation libraries in the React ecosystem like [Framer Motion](https://www.framer.com/motion/) and [React Spring](https://www.react-spring.io/). You just need to expose some state to those libraries.

For example, to animate the combobox with Framer Motion, add the `static` prop to the `ComboboxOptions` component and then conditionally render it based on the `open` render prop:

    import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
    import { AnimatePresence, motion } from 'framer-motion'
    import { useState } from 'react'
    
    const people = [
      { id: 1, name: 'Durward Reynolds' },
      { id: 2, name: 'Kenton Towne' },
      { id: 3, name: 'Therese Wunsch' },
      { id: 4, name: 'Benedict Kessler' },
      { id: 5, name: 'Katelyn Rohan' },
    ]
    
    function Example() {
      const [selectedPerson, setSelectedPerson] = useState(people[0])
      const [query, setQuery] = useState('')
    
      const filteredPeople =
        query === ''
          ? people
          : people.filter((person) => {
              return person.name.toLowerCase().includes(query.toLowerCase())
            })
    
      return (
        <Combobox value={selectedPerson} onChange={setSelectedPerson}>
          {({ open }) => (        <>
              <ComboboxInput
                aria-label="Assignee"
                displayValue={(person) => person?.name}
                onChange={(event) => setQuery(event.target.value)}
              />
              <AnimatePresence>
                {open && (              <ComboboxOptions
                    static                as={motion.div}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    anchor="bottom"
                    className="origin-top border empty:invisible"
                    onAnimationComplete={() => setQuery('')}
                  >
                    {filteredPeople.map((person) => (
                      <ComboboxOption key={person.id} value={person} className="data-focus:bg-blue-100">
                        {person.name}
                      </ComboboxOption>
                    ))}
                  </ComboboxOptions>
                )}          </AnimatePresence>
            </>
          )}    </Combobox>
      )
    }
    

### [](#binding-objects-as-values)

Unlike native HTML form controls, which only allow you to provide strings as values, Headless UI supports binding complex objects as well.

When binding objects, make sure to set the `displayValue` on your `ComboboxInput` so that a string representation of the selected option can be rendered in the input:

    import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
    import { useState } from 'react'
    
    const people = [  { id: 1, name: 'Durward Reynolds' },  { id: 2, name: 'Kenton Towne' },  { id: 3, name: 'Therese Wunsch' },  { id: 4, name: 'Benedict Kessler' },  { id: 5, name: 'Katelyn Rohan' },]
    function Example() {
      const [selectedPerson, setSelectedPerson] = useState(people[0])
      const [query, setQuery] = useState('')
    
      const filteredPeople =
        query === ''
          ? people
          : people.filter((person) => {
              return person.name.toLowerCase().includes(query.toLowerCase())
            })
    
      return (
        <Combobox value={selectedPerson} onChange={setSelectedPerson} onClose={() => setQuery('')}>      <ComboboxInput
            aria-label="Assignee"
            displayValue={(person) => person?.name}        onChange={(event) => setQuery(event.target.value)}
          />
          <ComboboxOptions anchor="bottom" className="border empty:invisible">
            {filteredPeople.map((person) => (
              <ComboboxOption key={person.id} value={person} className="data-focus:bg-blue-100">
                {person.name}          </ComboboxOption>
            ))}
          </ComboboxOptions>
        </Combobox>
      )
    }
    

When binding objects as values, it's important to make sure that you use the _same instance_ of the object as both the `value` of the `Combobox` as well as the corresponding `ComboboxOption`, otherwise they will fail to be equal and cause the combobox to behave incorrectly.

To make it easier to work with different instances of the same object, you can use the `by` prop to compare the objects by a particular field instead of comparing object identity.

When you pass an object to the `value` prop, `by` will default to `id` when present, but you can set it to any field you like:

    import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
    import { useState } from 'react'
    
    const departments = [
      { name: 'Marketing', contact: 'Durward Reynolds' },
      { name: 'HR', contact: 'Kenton Towne' },
      { name: 'Sales', contact: 'Therese Wunsch' },
      { name: 'Finance', contact: 'Benedict Kessler' },
      { name: 'Customer service', contact: 'Katelyn Rohan' },
    ]
    
    function DepartmentPicker({ selectedDepartment, onChange }) {  const [query, setQuery] = useState('')
    
      const filteredDepartments =
        query === ''
          ? departments
          : departments.filter((department) => {
              return department.name.toLowerCase().includes(query.toLowerCase())
            })
    
      return (
        <Combobox value={selectedDepartment} by="name" onChange={onChange} onClose={() => setQuery('')}>      <ComboboxInput
            aria-label="Department"
            displayValue={(department) => department?.name}
            onChange={(event) => setQuery(event.target.value)}
          />
          <ComboboxOptions anchor="bottom" className="border empty:invisible">
            {filteredDepartments.map((department) => (
              <ComboboxOption key={department.id} value={department} className="data-focus:bg-blue-100">
                {department.name}
              </ComboboxOption>
            ))}
          </ComboboxOptions>
        </Combobox>
      )
    }
    

You can also pass your own comparison function to the `by` prop if you'd like complete control over how objects are compared:

    import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
    import { useState } from 'react'
    
    const departments = [
      { id: 1, name: 'Marketing', contact: 'Durward Reynolds' },
      { id: 2, name: 'HR', contact: 'Kenton Towne' },
      { id: 3, name: 'Sales', contact: 'Therese Wunsch' },
      { id: 4, name: 'Finance', contact: 'Benedict Kessler' },
      { id: 5, name: 'Customer service', contact: 'Katelyn Rohan' },
    ]
    
    function compareDepartments(a, b) {  return a.name.toLowerCase() === b.name.toLowerCase()}
    function DepartmentPicker({ selectedDepartment, onChange }) {
      const [query, setQuery] = useState('')
    
      const filteredDepartments =
        query === ''
          ? departments
          : departments.filter((department) => {
              return department.name.toLowerCase().includes(query.toLowerCase())
            })
    
      return (
        <Combobox value={selectedDepartment} by={compareDepartments} onChange={onChange} onClose={() => setQuery('')}>      <ComboboxInput
            aria-label="Department"
            displayValue={(department) => department?.name}
            onChange={(event) => setQuery(event.target.value)}
          />
          <ComboboxOptions anchor="bottom" className="border empty:invisible">
            {filteredDepartments.map((department) => (
              <ComboboxOption key={department.id} value={department} className="data-focus:bg-blue-100">
                {department.name}
              </ComboboxOption>
            ))}
          </ComboboxOptions>
        </Combobox>
      )
    }
    

### [](#binding-strings-as-values)

While it's very common to [bind objects as values](#binding-objects-as-values), you can also provide simple string values.

When doing this you can omit the `displayValue` prop from the `ComboboxInput`.

    import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
    import { useState } from 'react'
    
    const people = ['Durward Reynolds', 'Kenton Towne', 'Therese Wunsch', 'Benedict Kessler', 'Katelyn Rohan']
    function Example() {
      const [selectedPerson, setSelectedPerson] = useState(people[0])
      const [query, setQuery] = useState('')
    
      const filteredPeople =
        query === ''
          ? people
          : people.filter((person) => {
              return person.toLowerCase().includes(query.toLowerCase())
            })
    
      return (
        <Combobox value={selectedPerson} onChange={setSelectedPerson} onClose={() => setQuery('')}>
          <ComboboxInput aria-label="Assignee" onChange={(event) => setQuery(event.target.value)} />
          <ComboboxOptions anchor="bottom" className="border empty:invisible">
            {filteredPeople.map((person) => (
              <ComboboxOption key={person} value={person} className="data-focus:bg-blue-100">            {person}          </ComboboxOption>        ))}
          </ComboboxOptions>
        </Combobox>
      )
    }
    

### [](#selecting-multiple-values)

To allow selecting multiple values in your combobox, use the `multiple` prop and pass an array to `value` instead of a single option.

    import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
    import { useState } from 'react'
    
    const people = [
      { id: 1, name: 'Durward Reynolds' },
      { id: 2, name: 'Kenton Towne' },
      { id: 3, name: 'Therese Wunsch' },
      { id: 4, name: 'Benedict Kessler' },
      { id: 5, name: 'Katelyn Rohan' },
    ]
    
    function Example() {
      const [selectedPeople, setSelectedPeople] = useState([people[0], people[1]])  const [query, setQuery] = useState('')
    
      const filteredPeople =
        query === ''
          ? people
          : people.filter((person) => {
              return person.name.toLowerCase().includes(query.toLowerCase())
            })
    
      return (
        <Combobox multiple value={selectedPeople} onChange={setSelectedPeople} onClose={() => setQuery('')}>      {selectedPeople.length > 0 && (
            <ul>
              {selectedPeople.map((person) => (
                <li key={person.id}>{person.name}</li>
              ))}
            </ul>
          )}
          <ComboboxInput aria-label="Assignees" onChange={(event) => setQuery(event.target.value)} />
          <ComboboxOptions anchor="bottom" className="border empty:invisible">
            {filteredPeople.map((person) => (
              <ComboboxOption key={person.id} value={person} className="data-focus:bg-blue-100">
                {person.name}
              </ComboboxOption>
            ))}
          </ComboboxOptions>
        </Combobox>
      )
    }
    

Your `onChange` handler will be called with an array containing all selected options any time an option is added or removed.

### [](#opening-the-dropdown-on-focus)

Use the `immediate` prop to immediately open the combobox options when the combobox input is focused.

    import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
    import { useState } from 'react'
    
    const people = [
      { id: 1, name: 'Durward Reynolds' },
      { id: 2, name: 'Kenton Towne' },
      { id: 3, name: 'Therese Wunsch' },
      { id: 4, name: 'Benedict Kessler' },
      { id: 5, name: 'Katelyn Rohan' },
    ]
    
    function Example() {
      const [selectedPerson, setSelectedPerson] = useState(people[0])
      const [query, setQuery] = useState('')
    
      const filteredPeople =
        query === ''
          ? people
          : people.filter((person) => {
              return person.name.toLowerCase().includes(query.toLowerCase())
            })
    
      return (
        <Combobox immediate value={selectedPerson} onChange={setSelectedPerson} onClose={() => setQuery('')}>      <ComboboxInput
            aria-label="Assignee"
            displayValue={(person) => person?.name}
            onChange={(event) => setQuery(event.target.value)}
          />
          <ComboboxOptions anchor="bottom" className="border empty:invisible">
            {filteredPeople.map((person) => (
              <ComboboxOption key={person.id} value={person} className="data-focus:bg-blue-100">
                {person.name}
              </ComboboxOption>
            ))}
          </ComboboxOptions>
        </Combobox>
      )
    }
    

### [](#rendering-as-different-elements)

By default, the `Combobox` and its subcomponents each render a default element that is sensible for that component.

For example, `ComboboxInput` renders an `input`, `ComboboxButton` renders a `button`, `ComboboxOptions` renders a `div`, and `ComboboxOption` renders a `div`. By contrast, `Combobox` _does not render an element_, and instead renders its children directly.

Use the `as` prop to render the component as a different element or as your own custom component, making sure your custom components [forward refs](https://react.dev/reference/react/forwardRef) so that Headless UI can wire things up correctly.

    import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
    import { forwardRef, useState } from 'react'
    
    const people = [
      { id: 1, name: 'Durward Reynolds' },
      { id: 2, name: 'Kenton Towne' },
      { id: 3, name: 'Therese Wunsch' },
      { id: 4, name: 'Benedict Kessler' },
      { id: 5, name: 'Katelyn Rohan' },
    ]
    
    let MyCustomButton = forwardRef(function (props, ref) {  return <button className="..." ref={ref} {...props} />})
    function Example() {
      const [selectedPerson, setSelectedPerson] = useState(people[0])
      const [query, setQuery] = useState('')
    
      const filteredPeople =
        query === ''
          ? people
          : people.filter((person) => {
              return person.name.toLowerCase().includes(query.toLowerCase())
            })
    
      return (
        <Combobox value={selectedPerson} onChange={setSelectedPerson} onClose={() => setQuery('')}>      <ComboboxInput
            aria-label="Assignee"
            displayValue={(person) => person?.name}
            onChange={(event) => setQuery(event.target.value)}
          />
          <ComboboxButton as={MyCustomButton}>Open</ComboboxButton>
          <ComboboxOptions as="ul" anchor="bottom" className="border empty:invisible">        {filteredPeople.map((person) => (
              <ComboboxOption as="li" key={person.id} value={person} className="data-focus:bg-blue-100">            {person.name}
              </ComboboxOption>
            ))}
          </ComboboxOptions>
        </Combobox>
      )
    }
    

To tell an element to render its children directly with no wrapper element, use a `Fragment`.

    import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
    import { Fragment, useState } from 'react'
    
    const people = [
      { id: 1, name: 'Durward Reynolds' },
      { id: 2, name: 'Kenton Towne' },
      { id: 3, name: 'Therese Wunsch' },
      { id: 4, name: 'Benedict Kessler' },
      { id: 5, name: 'Katelyn Rohan' },
    ]
    
    function Example() {
      const [selectedPerson, setSelectedPerson] = useState(people[0])
      const [query, setQuery] = useState('')
    
      const filteredPeople =
        query === ''
          ? people
          : people.filter((person) => {
              return person.name.toLowerCase().includes(query.toLowerCase())
            })
    
      return (
        <Combobox value={selectedPerson} onChange={setSelectedPerson} onClose={() => setQuery('')}>
          <ComboboxInput
            as={Fragment}        aria-label="Assignee"
            displayValue={(person) => person?.name}
            onChange={(event) => setQuery(event.target.value)}
          >
            <input />
          </ComboboxInput>
          <ComboboxOptions anchor="bottom" className="border empty:invisible">
            {filteredPeople.map((person) => (
              <ComboboxOption key={person.id} value={person} className="data-focus:bg-blue-100">
                {person.name}
              </ComboboxOption>
            ))}
          </ComboboxOptions>
        </Combobox>
      )
    }
    

### [](#rendering-active-option-details)

Depending on what you're building it can sometimes make sense to render additional information about the active option outside of the `ComboboxOptions`. For example, a preview of the active option within the context of a command palette. In these situations you can read the `activeOption` render prop argument to access this information.

    import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
    import { useState } from 'react'
    
    const people = [
      { id: 1, name: 'Durward Reynolds' },
      { id: 2, name: 'Kenton Towne' },
      { id: 3, name: 'Therese Wunsch' },
      { id: 4, name: 'Benedict Kessler' },
      { id: 5, name: 'Katelyn Rohan' },
    ]
    
    function Example() {
      const [selectedPerson, setSelectedPerson] = useState(people[0])
      const [query, setQuery] = useState('')
    
      const filteredPeople =
        query === ''
          ? people
          : people.filter((person) => {
              return person.name.toLowerCase().includes(query.toLowerCase())
            })
    
      return (
        <Combobox value={selectedPerson} onChange={setSelectedPerson} onClose={() => setQuery('')}>
          {({ activeOption }) => (        <>
              <ComboboxInput
                aria-label="Assignee"
                displayValue={(person) => person?.name}
                onChange={(event) => setQuery(event.target.value)}
              />
              <ComboboxOptions anchor="bottom" className="border empty:invisible">
                {filteredPeople.map((person) => (
                  <ComboboxOption key={person.id} value={person} className="data-focus:bg-blue-100">
                    {person.name}
                  </ComboboxOption>
                ))}
              </ComboboxOptions>
              {activeOption && <div>The currently focused user is: {activeOption.name}</div>}        </>
          )}
        </Combobox>
      )
    }
    

The `activeOption` will be the `value` of the currently focused `ComboboxOption`.

### [](#virtual-scrolling)

By default the `Combobox` renders all its options into the DOM. While this is a good default, this can cause performance issues when given a really large number of options. For these situations we provide a virtual scrolling API.

To enable virtual scrolling, provide a list of options to the `Combobox` via the `virtual.options` prop, as well as a render prop to the `ComboboxOptions`, which acts as a template for each option:

    import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
    import { useState } from 'react'
    
    const people = [
      { id: 1, name: 'Durward Reynolds' },
      { id: 2, name: 'Kenton Towne' },
      { id: 3, name: 'Therese Wunsch' },
      { id: 4, name: 'Benedict Kessler' },
      { id: 5, name: 'Katelyn Rohan' },
      // +1000 more people
    ]
    
    function Example() {
      const [selectedPerson, setSelectedPerson] = useState(people[0])
      const [query, setQuery] = useState('')
    
      const filteredPeople =
        query === ''
          ? people
          : people.filter((person) => {
              return person.name.toLowerCase().includes(query.toLowerCase())
            })
    
      return (
        <Combobox
          value={selectedPerson}
          virtual={{ options: filteredPeople }}      onChange={setSelectedPerson}
          onClose={() => setQuery('')}
        >
          <ComboboxInput
            aria-label="Assignee"
            displayValue={(person) => person?.name}
            onChange={(event) => setQuery(event.target.value)}
          />
          <ComboboxOptions anchor="bottom" className="w-(--input-width) border empty:invisible">
            {({ option: person }) => (          <ComboboxOption value={person} className="data-focus:bg-blue-100">            {person.name}          </ComboboxOption>        )}      </ComboboxOptions>
        </Combobox>
      )
    }
    

To specify whether a given option is disabled, provide a callback to the `virtual.disabled` prop:

    import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
    import { useState } from 'react'
    
    const people = [
      { id: 1, name: 'Durward Reynolds', available: true },
      { id: 2, name: 'Kenton Towne', available: true },
      { id: 3, name: 'Therese Wunsch', available: true },
      { id: 4, name: 'Benedict Kessler', available: false },  { id: 5, name: 'Katelyn Rohan', available: true },
      // +1000 more people
    ]
    
    function Example() {
      const [selectedPerson, setSelectedPerson] = useState(people[0])
      const [query, setQuery] = useState('')
    
      const filteredPeople =
        query === ''
          ? people
          : people.filter((person) => {
              return person.name.toLowerCase().includes(query.toLowerCase())
            })
    
      return (
        <Combobox
          value={selectedPerson}
          virtual={{
            options: filteredPeople,
            disabled: (person) => !person.available,      }}
          onChange={setSelectedPerson}
          onClose={() => setQuery('')}
        >
          <ComboboxInput
            aria-label="Assignee"
            displayValue={(person) => person?.name}
            onChange={(event) => setQuery(event.target.value)}
          />
          <ComboboxOptions anchor="bottom" className="w-(--input-width) border empty:invisible">
            {({ option: person }) => (
              <ComboboxOption value={person} className="data-disabled:opacity-50 data-focus:bg-blue-100">            {person.name}
              </ComboboxOption>
            )}
          </ComboboxOptions>
        </Combobox>
      )
    }
    

[](#keyboard-interaction)
-------------------------

[](#component-api)
------------------

### [](#combobox)

The main combobox component.

### [](#combobox-options)

The component that directly wraps the list of options in your custom Combobox.

### [](#combobox-option)

Used to wrap each item within your Combobox.</content>
</page>

<page>
  <title>Headless UI</title>
  <url>https://headlessui.com/react/button</url>
  <content>A light wrapper around the native button element that provides more opinionated states for things like hover and focus.

[](#installation)
-----------------

To get started, install Headless UI via npm:

    npm install @headlessui/react

[](#basic-example)
------------------

Buttons are built using the `Button` component:

    import { Button } from '@headlessui/react'
    
    function Example() {
      return (
        <Button className="rounded bg-sky-600 px-4 py-2 text-sm text-white data-active:bg-sky-700 data-hover:bg-sky-500">
          Save changes
        </Button>
      )
    }

You can pass any props to a `Button` that you'd normally pass to the native `button` element.

[](#styling)
------------

Headless UI keeps track of a lot of state about each component, like whether or not an input is focused, whether a popover is open or closed, or which item in a menu is currently focused via the keyboard.

But because the components are headless and completely unstyled out of the box, you can't see this information in your UI until you provide the styles you want for each state yourself.

### [](#using-data-attributes)

The easiest way to style the different states of a Headless UI component is using the `data-*` attributes that each component exposes.

For example, the `Button` component exposes a `data-hover` attribute, which tells you if the button is currently being hovered by the mouse, and a `data-active` attribute, which tells you if the button is currently being pressed.

    <!-- Rendered `Button` -->
    <button type="button" data-hover data-active></button>

Use the [CSS attribute selector](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors) to conditionally apply styles based on the presence of these data attributes. If you're using Tailwind CSS, the [data attribute modifier](https://tailwindcss.com/docs/hover-focus-and-other-states#data-attributes) makes this easy:

    import { Button } from '@headlessui/react'
    
    function Example() {
      return (
        <Button className="rounded bg-sky-600 px-4 py-2 text-sm text-white data-hover:bg-sky-500 data-hover:data-active:bg-sky-700">      Save changes
        </Button>
      )
    }
    

See the [component API](#component-api) for a list of all the available data attributes.

### [](#using-render-props)

Each component also exposes information about its current state via [render props](https://reactjs.org/docs/render-props.html) that you can use to conditionally apply different styles or render different content.

For example, the `Button` component exposes a `hover` state, which tells you if the button is currently being hovered by the mouse, and an `active` state, which tells you if the button is currently being pressed.

    import { Button } from '@headlessui/react'
    import clsx from 'clsx'
    import { Fragment } from 'react'
    
    function Example() {
      return (
        <Button as={Fragment}>
          {({ hover, active }) => (        <button
              className={clsx(
                'rounded px-4 py-2 text-sm text-white',
                !hover && !active && 'bg-sky-600',            hover && !active && 'bg-sky-500',            active && 'bg-sky-700'          )}
            >
              Save changes
            </button>
          )}    </Button>
      )
    }
    

See the [component API](#component-api) for a list of all the available render props.

[](#examples)
-------------

### [](#disabling-a-button)

Add the `disabled` prop to a `Button` to disable it:

    import { Button } from '@headlessui/react'
    
    function Example() {
      return (
        <Button
          disabled      className="rounded bg-sky-600 px-4 py-2 text-sm text-white data-active:bg-sky-700 data-disabled:bg-gray-500 data-hover:bg-sky-500"
        >
          Save changes
        </Button>
      )
    }
    

[](#component-api)
------------------

### [](#button)

A thin wrapper around the native `button` element.</content>
</page>

<page>
  <title>Headless UI</title>
  <url>https://headlessui.com/react/fieldset</url>
  <content>Group a set of form controls together with these fully accessible but much easier-to-style versions of the native fieldset and legend elements.

[](#installation)
-----------------

To get started, install Headless UI via npm:

    npm install @headlessui/react

[](#basic-example)
------------------

Use the `Fieldset` and `Legend` components to group a set of form controls together with a title:

    import { Field, Fieldset, Input, Label, Legend, Select, Textarea } from '@headlessui/react'
    
    function Example() {
      return (
        <Fieldset className="space-y-8">
          <Legend className="text-lg font-bold">Shipping details</Legend>
          <Field>
            <Label className="block">Street address</Label>
            <Input className="mt-1 block" name="address" />
          </Field>
          <Field>
            <Label className="block">Country</Label>
            <Select className="mt-1 block" name="country">
              <option>Canada</option>
              <option>Mexico</option>
              <option>United States</option>
            </Select>
          </Field>
          <Field>
            <Label className="block">Delivery notes</Label>
            <Textarea className="mt-1 block" name="notes" />
          </Field>
        </Fieldset>
      )
    }

Since the native HTML `<legend>` element is difficult to style, the `Legend` component is rendered as a `<div>`. The `<Fieldset>` component uses the native `<fieldset>` component.

[](#styling)
------------

Headless UI keeps track of a lot of state about each component, like whether or not a fieldset is disabled, whether a popover is open or closed, or which item in a menu is currently focused via the keyboard.

But because the components are headless and completely unstyled out of the box, you can't see this information in your UI until you provide the styles you want for each state yourself.

### [](#using-data-attributes)

The easiest way to style the different states of a Headless UI component is using the `data-*` attributes that each component exposes.

For example, both the `Fieldset` and `Legend` components expose a `data-disabled` attribute, which tells you if the fieldset is currently disabled.

    <!-- Rendered `Fieldset` and `Legend` -->
    <fieldset aria-labelledby="..." disabled data-disabled>
      <div id="..." data-disabled>Shipping details</div>
      <!-- ... -->
    </fieldset>

Use the [CSS attribute selector](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors) to conditionally apply styles based on the presence of these data attributes. If you're using Tailwind CSS, the [data attribute modifier](https://tailwindcss.com/docs/hover-focus-and-other-states#data-attributes) makes this easy:

    import { Fieldset, Legend } from '@headlessui/react'
    
    function Example() {
      return (
        <Fieldset disabled className="space-y-8 data-disabled:opacity-50">      <Legend className="text-lg font-bold">Shipping details</Legend>
          {/* ... */}
        </Fieldset>
      )
    }
    

See the [component API](#component-api) for a list of all the available data attributes.

### [](#using-render-props)

Each component also exposes information about its current state via [render props](https://reactjs.org/docs/render-props.html) that you can use to conditionally apply different styles or render different content.

For example, both the `Fieldset` and `Legend` components expose a `disabled` state, which tells you if the fieldset is currently disabled.

    import { Fieldset, Legend } from '@headlessui/react'
    import clsx from 'clsx'
    import { Fragment } from 'react'
    
    function Example() {
      return (
        <Fieldset disabled as={Fragment}>
          {({ disabled }) => (        <div className={clsx('space-y-8', disabled && 'opacity-50')}>          <Legend className="text-lg font-bold">Shipping details</Legend>
              {/* ... */}
            </div>
          )}    </Fieldset>
      )
    }
    

See the [component API](#component-api) for a list of all the available render props.

[](#examples)
-------------

### [](#disabling-a-fieldset)

Add the `disabled` prop to a `Fieldset` component to disable the entire fieldset:

    import { Fieldset, Legend } from '@headlessui/react'
    
    function Example() {
      return (
        <Fieldset disabled>      <Legend>Shipping details</Legend>
          {/* ... */}
        </Fieldset>
      )
    }
    

[](#component-api)
------------------

### [](#fieldset)

Group a set of form controls together with a title.

### [](#legend)

The title for a `Fieldset`.</content>
</page>

<page>
  <title>Headless UI</title>
  <url>https://headlessui.com/react/input</url>
  <content>A light wrapper around the native input element that handles tedious accessibility concerns and provides more opinionated states for things like hover and focus.

[](#installation)
-----------------

To get started, install Headless UI via npm:

    npm install @headlessui/react

[](#basic-example)
------------------

Inputs are built using the `Input` component:

    import { Input } from '@headlessui/react'
    
    function Example() {
      return <Input name="full_name" type="text" />
    }

You can pass any props to an `Input` that you'd normally pass to the native `input` element.

[](#styling)
------------

Headless UI keeps track of a lot of state about each component, like whether or not an input is focused, whether a popover is open or closed, or which item in a menu is currently focused via the keyboard.

But because the components are headless and completely unstyled out of the box, you can't see this information in your UI until you provide the styles you want for each state yourself.

### [](#using-data-attributes)

The easiest way to style the different states of a Headless UI component is using the `data-*` attributes that each component exposes.

For example, the `Input` component exposes a `data-focus` attribute, which tells you if the input is currently focused via the mouse or keyboard, and a `data-hover` attribute, which tells you if the input is currently being hovered by the mouse.

    <!-- Rendered `Input` -->
    <input type="text" name="full_name" data-focus data-hover />

Use the [CSS attribute selector](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors) to conditionally apply styles based on the presence of these data attributes. If you're using Tailwind CSS, the [data attribute modifier](https://tailwindcss.com/docs/hover-focus-and-other-states#data-attributes) makes this easy:

    import { Input } from '@headlessui/react'
    
    function Example() {
      return <Input type="text" name="full_name" className="border data-focus:bg-blue-100 data-hover:shadow" />}
    

See the [component API](#component-api) for a list of all the available data attributes.

### [](#using-render-props)

Each component also exposes information about its current state via [render props](https://reactjs.org/docs/render-props.html) that you can use to conditionally apply different styles or render different content.

For example, the `Input` component exposes a `focus` state, which tells you if the input is currently focused via the mouse or keyboard, and a `hover` state, which tells you if the input is currently being hovered by the mouse.

    import { Input } from '@headlessui/react'
    import clsx from 'clsx'
    import { Fragment } from 'react'
    
    function Example() {
      return (
        <Input type="text" name="full_name" as={Fragment}>
          {({ focus, hover }) => <input className={clsx('border', focus && 'bg-blue-100', hover && 'shadow')} />}    </Input>
      )
    }
    

See the [component API](#component-api) for a list of all the available render props.

[](#examples)
-------------

### [](#adding-a-label)

Wrap a `Label` and `Input` with the `Field` component to automatically associate them using a generated ID:

    import { Field, Input, Label } from '@headlessui/react'
    
    function Example() {
      return (
        <Field>      <Label>Name</Label>      <Input name="full_name" />
        </Field>  )
    }
    

### [](#adding-a-description)

Use the `Description` component within a `Field` to automatically associate it with an `Input` using the `aria-describedby` attribute:

    import { Description, Field, Input, Label } from '@headlessui/react'
    
    function Example() {
      return (
        <Field>      <Label>Name</Label>
          <Description>Use your real name so people will recognize you.</Description>      <Input name="full_name" />
        </Field>  )
    }
    

### [](#disabling-an-input)

Add the `disabled` prop to the `Field` component to disable an `Input` and its associated `Label` and `Description`:

    import { Description, Field, Input, Label } from '@headlessui/react'
    
    function Example() {
      return (
        <Field disabled>      <Label className="data-disabled:opacity-50">Name</Label>
          <Description className="data-disabled:opacity-50">Use your real name so people will recognize you.</Description>
          <Input name="full_name" className="data-disabled:bg-gray-100" />
        </Field>
      )
    }
    

You can also disable an input outside of a `Field` by adding the disabled prop directly to the `Input` itself.

[](#component-api)
------------------

### [](#input)

A thin wrapper around the native `input` element.

Groups a `Label`, `Description`, and form control together.

The `Label` component labels a form control.

The `Description` component describes a form control.</content>
</page>

<page>
  <title>Headless UI</title>
  <url>https://headlessui.com/react/listbox</url>
  <content>Listboxes are a great foundation for building custom, accessible select menus for your app, complete with robust support for keyboard navigation.

[](#installation)
-----------------

To get started, install Headless UI via npm:

    npm install @headlessui/react

[](#basic-example)
------------------

Listboxes are built using the `Listbox`, `ListboxButton`, `ListboxSelectedOption`, `ListboxOptions`, and `ListboxOption` components.

The `ListboxButton` will automatically open/close the `ListboxOptions` when clicked, and when the listbox is open, the list of options receives focus and is automatically navigable via the keyboard.

    import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
    import { useState } from 'react'
    
    const people = [
      { id: 1, name: 'Durward Reynolds' },
      { id: 2, name: 'Kenton Towne' },
      { id: 3, name: 'Therese Wunsch' },
      { id: 4, name: 'Benedict Kessler' },
      { id: 5, name: 'Katelyn Rohan' },
    ]
    
    function Example() {
      const [selectedPerson, setSelectedPerson] = useState(people[0])
    
      return (
        <Listbox value={selectedPerson} onChange={setSelectedPerson}>
          <ListboxButton>{selectedPerson.name}</ListboxButton>
          <ListboxOptions anchor="bottom">
            {people.map((person) => (
              <ListboxOption key={person.id} value={person} className="data-focus:bg-blue-100">
                {person.name}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </Listbox>
      )
    }

[](#styling)
------------

Headless UI keeps track of a lot of state about each component, like which listbox option is currently selected, whether a popover is open or closed, or which item in a menu is currently focused via the keyboard.

But because the components are headless and completely unstyled out of the box, you can't see this information in your UI until you provide the styles you want for each state yourself.

### [](#using-data-attributes)

The easiest way to style the different states of a Headless UI component is using the `data-*` attributes that each component exposes.

For example, the `ListboxOption` component exposes a `data-focus` attribute, which tells you if the option is currently focused via the mouse or keyboard, and a `data-selected` attribute, which tells you if that option matches the current `value` of the `Listbox`.

    <!-- Rendered `ListboxOption` -->
    <div data-focus data-selected>Arlene Mccoy</div>

Use the [CSS attribute selector](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors) to conditionally apply styles based on the presence of these data attributes. If you're using Tailwind CSS, the [data attribute modifier](https://tailwindcss.com/docs/hover-focus-and-other-states#data-attributes) makes this easy:

    import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
    import { CheckIcon } from '@heroicons/react/20/solid'
    import { useState } from 'react'
    
    const people = [
      { id: 1, name: 'Durward Reynolds' },
      { id: 2, name: 'Kenton Towne' },
      { id: 3, name: 'Therese Wunsch' },
      { id: 4, name: 'Benedict Kessler' },
      { id: 5, name: 'Katelyn Rohan' },
    ]
    
    function Example() {
      const [selectedPerson, setSelectedPerson] = useState(people[0])
    
      return (
        <Listbox value={selectedPerson} onChange={setSelectedPerson}>
          <ListboxButton>{selectedPerson.name}</ListboxButton>
          <ListboxOptions anchor="bottom">
            {people.map((person) => (
              <ListboxOption key={person.id} value={person} className="group flex gap-2 bg-white data-focus:bg-blue-100">            <CheckIcon className="invisible size-5 group-data-selected:visible" />            {person.name}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </Listbox>
      )
    }
    

See the [component API](#component-api) for a list of all the available data attributes.

### [](#using-render-props)

Each component also exposes information about its current state via [render props](https://reactjs.org/docs/render-props.html) that you can use to conditionally apply different styles or render different content.

For example, the `ListboxOption` component exposes a `focus` state, which tells you if the option is currently focused via the mouse or keyboard, and a `selected` state, which tells you if that option matches the current `value` of the `Listbox`.

    import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
    import { CheckIcon } from '@heroicons/react/20/solid'
    import clsx from 'clsx'
    import { Fragment, useState } from 'react'
    
    const people = [
      { id: 1, name: 'Durward Reynolds' },
      { id: 2, name: 'Kenton Towne' },
      { id: 3, name: 'Therese Wunsch' },
      { id: 4, name: 'Benedict Kessler' },
      { id: 5, name: 'Katelyn Rohan' },
    ]
    
    function Example() {
      const [selectedPerson, setSelectedPerson] = useState(people[0])
    
      return (
        <Listbox value={selectedPerson} onChange={setSelectedPerson}>
          <ListboxButton>{selectedPerson.name}</ListboxButton>
          <ListboxOptions anchor="bottom">
            {people.map((person) => (
              <ListboxOption key={person.id} value={person} as={Fragment}>            {({ focus, selected }) => (              <div className={clsx('flex gap-2', focus && 'bg-blue-100')}>                <CheckIcon className={clsx('size-5', !selected && 'invisible')} />                {person.name}              </div>            )}          </ListboxOption>        ))}
          </ListboxOptions>
        </Listbox>
      )
    }
    

See the [component API](#component-api) for a list of all the available render props.

[](#examples)
-------------

### [](#adding-a-label)

Wrap a `Label` and `Listbox` with the `Field` component to automatically associate them using a generated ID:

    import { Field, Label, Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
    import { useState } from 'react'
    
    const people = [
      { id: 1, name: 'Durward Reynolds' },
      { id: 2, name: 'Kenton Towne' },
      { id: 3, name: 'Therese Wunsch' },
      { id: 4, name: 'Benedict Kessler' },
      { id: 5, name: 'Katelyn Rohan' },
    ]
    
    function Example() {
      const [selectedPerson, setSelectedPerson] = useState(people[0])
    
      return (
        <Field>      <Label>Assignee:</Label>      <Listbox value={selectedPerson} onChange={setSelectedPerson}>
            <ListboxButton>{selectedPerson.name}</ListboxButton>
            <ListboxOptions anchor="bottom">
              {people.map((person) => (
                <ListboxOption key={person.id} value={person} className="data-focus:bg-blue-100">
                  {person.name}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </Listbox>
        </Field>  )
    }
    

### [](#adding-a-description)

Use the `Description` component within a `Field` to automatically associate it with a `Listbox` using the `aria-describedby` attribute:

    import { Description, Field, Label, Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
    import { useState } from 'react'
    
    const people = [
      { id: 1, name: 'Durward Reynolds' },
      { id: 2, name: 'Kenton Towne' },
      { id: 3, name: 'Therese Wunsch' },
      { id: 4, name: 'Benedict Kessler' },
      { id: 5, name: 'Katelyn Rohan' },
    ]
    
    function Example() {
      const [selectedPerson, setSelectedPerson] = useState(people[0])
    
      return (
        <Field>      <Label>Assignee:</Label>
          <Description>This person will have full access to this project.</Description>      <Listbox value={selectedPerson} onChange={setSelectedPerson}>
            <ListboxButton>{selectedPerson.name}</ListboxButton>
            <ListboxOptions anchor="bottom">
              {people.map((person) => (
                <ListboxOption key={person.id} value={person} className="data-focus:bg-blue-100">
                  {person.name}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </Listbox>
        </Field>  )
    }
    

### [](#disabling-a-listbox)

Add the `disabled` prop to the `Field` component to disable a `Listbox` and its associated `Label` and `Description`:

    import { Description, Field, Label, Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
    import { useState } from 'react'
    
    const people = [
      { id: 1, name: 'Durward Reynolds' },
      { id: 2, name: 'Kenton Towne' },
      { id: 3, name: 'Therese Wunsch' },
      { id: 4, name: 'Benedict Kessler' },
      { id: 5, name: 'Katelyn Rohan' },
    ]
    
    function Example() {
      const [selectedPerson, setSelectedPerson] = useState(people[0])
    
      return (
        <Field disabled>      <Label>Assignee:</Label>
          <Description>This person will have full access to this project.</Description>
          <Listbox value={selectedPerson} onChange={setSelectedPerson}>
            <ListboxButton>{selectedPerson.name}</ListboxButton>
            <ListboxOptions anchor="bottom">
              {people.map((person) => (
                <ListboxOption key={person.id} value={person} className="data-focus:bg-blue-100">
                  {person.name}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </Listbox>
        </Field>
      )
    }
    

You can also disable a listbox outside of a `Field` by adding the disabled prop directly to the `Listbox` itself.

### [](#disabling-a-listbox-option)

Use the `disabled` prop to disable a `ListboxOption` and prevent it from being selected:

    import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
    import { useState } from 'react'
    
    const people = [
      { id: 1, name: 'Durward Reynolds', available: true },
      { id: 2, name: 'Kenton Towne', available: true },
      { id: 3, name: 'Therese Wunsch', available: true },
      { id: 4, name: 'Benedict Kessler', available: false },  { id: 5, name: 'Katelyn Rohan', available: true },
    ]
    
    function Example() {
      const [selectedPerson, setSelectedPerson] = useState(people[0])
    
      return (
        <Listbox value={selectedPerson} onChange={setSelectedPerson}>
          <ListboxButton>{selectedPerson.name}</ListboxButton>
          <ListboxOptions anchor="bottom">
            {people.map((person) => (
              <ListboxOption
                key={person.id}
                value={person}
                disabled={!person.available}            className="data-disabled:opacity-50 data-focus:bg-blue-100"          >
                {person.name}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </Listbox>
      )
    }
    

### [](#using-with-html-forms)

If you add the `name` prop to your `Listbox`, a hidden `input` element will be rendered and kept in sync with the listbox state.

    import { Field, Label, Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
    import { useState } from 'react'
    
    const people = [
      { id: 1, name: 'Durward Reynolds' },
      { id: 2, name: 'Kenton Towne' },
      { id: 3, name: 'Therese Wunsch' },
      { id: 4, name: 'Benedict Kessler' },
      { id: 5, name: 'Katelyn Rohan' },
    ]
    
    function Example() {
      const [selectedPerson, setSelectedPerson] = useState(people[0])
    
      return (
        <form action="/projects/1" method="post">      <Field>
            <Label>Assignee:</Label>
            <Listbox name="assignee" value={selectedPerson} onChange={setSelectedPerson}>          <ListboxButton>{selectedPerson.name}</ListboxButton>
              <ListboxOptions anchor="bottom">
                {people.map((person) => (
                  <ListboxOption key={person.id} value={person} className="data-focus:bg-blue-100">
                    {person.name}
                  </ListboxOption>
                ))}
              </ListboxOptions>
            </Listbox>
          </Field>
          <button>Submit</button>
        </form>  )
    }
    

This lets you use a listbox inside a native HTML `<form>` and make traditional form submissions as if your listbox was a native HTML form control.

Basic values like strings will be rendered as a single hidden input containing that value, but complex values like objects will be encoded into multiple inputs using a square bracket notation for the names:

    <!-- Rendered hidden inputs -->
    <input type="hidden" name="assignee[id]" value="1" />
    <input type="hidden" name="assignee[name]" value="Durward Reynolds" />

### [](#using-as-uncontrolled)

If you omit the `value` prop, Headless UI will track its state internally for you, allowing you to use it as an [uncontrolled component](https://reactjs.org/docs/uncontrolled-components.html).

When uncontrolled, use the `defaultValue` prop to provide an initial value to the `Listbox`.

    import { Field, Label, Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
    
    const people = [
      { id: 1, name: 'Durward Reynolds' },
      { id: 2, name: 'Kenton Towne' },
      { id: 3, name: 'Therese Wunsch' },
      { id: 4, name: 'Benedict Kessler' },
      { id: 5, name: 'Katelyn Rohan' },
    ]
    
    function Example() {
      return (
        <form action="/projects/1" method="post">
          <Field>
            <Label>Assignee:</Label>
            <Listbox name="assignee" defaultValue={people[0]}>          <ListboxButton>{({ value }) => value.name}</ListboxButton>
              <ListboxOptions anchor="bottom">
                {people.map((person) => (
                  <ListboxOption key={person.id} value={person} className="data-focus:bg-blue-100">
                    {person.name}
                  </ListboxOption>
                ))}
              </ListboxOptions>
            </Listbox>
          </Field>
          <button>Submit</button>
        </form>
      )
    }
    

This can simplify your code when using the listbox [with HTML forms](#using-with-html-forms) or with form APIs that collect their state using [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData) instead of tracking it using React state.

Any `onChange` prop you provide will still be called when the component's value changes in case you need to run any side effects, but you won't need to use it to track the component's state yourself.

### [](#setting-the-dropdown-width)

The `ListboxOptions` dropdown has no width set by default, but you can add one using CSS:

    import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
    import { useState } from 'react'
    
    const people = [
      { id: 1, name: 'Durward Reynolds' },
      { id: 2, name: 'Kenton Towne' },
      { id: 3, name: 'Therese Wunsch' },
      { id: 4, name: 'Benedict Kessler' },
      { id: 5, name: 'Katelyn Rohan' },
    ]
    
    function Example() {
      const [selectedPerson, setSelectedPerson] = useState(people[0])
    
      return (
        <Listbox value={selectedPerson} onChange={setSelectedPerson}>
          <ListboxButton>{selectedPerson.name}</ListboxButton>
          <ListboxOptions anchor="bottom" className="w-52">        {people.map((person) => (
              <ListboxOption key={person.id} value={person} className="data-focus:bg-blue-100">
                {person.name}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </Listbox>
      )
    }
    

If you'd like the dropdown width to match the `ListboxButton` width, use the `--button-width` CSS variable that's exposed on the `ListboxOptions` element:

    import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
    import { useState } from 'react'
    
    const people = [
      { id: 1, name: 'Durward Reynolds' },
      { id: 2, name: 'Kenton Towne' },
      { id: 3, name: 'Therese Wunsch' },
      { id: 4, name: 'Benedict Kessler' },
      { id: 5, name: 'Katelyn Rohan' },
    ]
    
    function Example() {
      const [selectedPerson, setSelectedPerson] = useState(people[0])
    
      return (
        <Listbox value={selectedPerson} onChange={setSelectedPerson}>
          <ListboxButton>{selectedPerson.name}</ListboxButton>
          <ListboxOptions anchor="bottom" className="w-(--button-width)">        {people.map((person) => (
              <ListboxOption key={person.id} value={person} className="data-focus:bg-blue-100">
                {person.name}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </Listbox>
      )
    }
    

### [](#positioning-the-dropdown)

Add the `anchor` prop to the `ListboxOptions` to automatically position the dropdown relative to the `ListboxButton`:

    import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
    import { useState } from 'react'
    
    const people = [
      { id: 1, name: 'Durward Reynolds' },
      { id: 2, name: 'Kenton Towne' },
      { id: 3, name: 'Therese Wunsch' },
      { id: 4, name: 'Benedict Kessler' },
      { id: 5, name: 'Katelyn Rohan' },
    ]
    
    function Example() {
      const [selectedPerson, setSelectedPerson] = useState(people[0])
    
      return (
        <Listbox value={selectedPerson} onChange={setSelectedPerson}>
          <ListboxButton>{selectedPerson.name}</ListboxButton>
          <ListboxOptions anchor="bottom start">        {people.map((person) => (
              <ListboxOption key={person.id} value={person} className="data-focus:bg-blue-100">
                {person.name}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </Listbox>
      )
    }
    

Use the values `top`, `right`, `bottom`, or `left` to center the dropdown along the appropriate edge, or combine it with `start` or `end` to align the dropdown to a specific corner, such as `top start` or `bottom end`.

To control the gap between the button and the dropdown, use the `--anchor-gap` CSS variable:

    import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
    import { useState } from 'react'
    
    const people = [
      { id: 1, name: 'Durward Reynolds' },
      { id: 2, name: 'Kenton Towne' },
      { id: 3, name: 'Therese Wunsch' },
      { id: 4, name: 'Benedict Kessler' },
      { id: 5, name: 'Katelyn Rohan' },
    ]
    
    function Example() {
      const [selectedPerson, setSelectedPerson] = useState(people[0])
    
      return (
        <Listbox value={selectedPerson} onChange={setSelectedPerson}>
          <ListboxButton>{selectedPerson.name}</ListboxButton>
          <ListboxOptions anchor="bottom start" className="[--anchor-gap:4px] sm:[--anchor-gap:8px]">        {people.map((person) => (
              <ListboxOption key={person.id} value={person} className="data-focus:bg-blue-100">
                {person.name}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </Listbox>
      )
    }
    

Additionally, you can use `--anchor-offset` to control the distance that the dropdown should be nudged from its original position, and `--anchor-padding` to control the minimum space that should exist between the dropdown and the viewport.

The `anchor` prop also supports an object API that allows you to control the `gap`, `offset`, and `padding` values using JavaScript:

    import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
    import { useState } from 'react'
    
    const people = [
      { id: 1, name: 'Durward Reynolds' },
      { id: 2, name: 'Kenton Towne' },
      { id: 3, name: 'Therese Wunsch' },
      { id: 4, name: 'Benedict Kessler' },
      { id: 5, name: 'Katelyn Rohan' },
    ]
    
    function Example() {
      const [selectedPerson, setSelectedPerson] = useState(people[0])
    
      return (
        <Listbox value={selectedPerson} onChange={setSelectedPerson}>
          <ListboxButton>{selectedPerson.name}</ListboxButton>
          <ListboxOptions anchor={{ to: 'bottom start', gap: '4px' }}>        {people.map((person) => (
              <ListboxOption key={person.id} value={person} className="data-focus:bg-blue-100">
                {person.name}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </Listbox>
      )
    }
    

See the [ListboxOptions API](#listbox-options) for more information about these options.

### [](#displaying-options-horizontally)

If you've styled your `ListboxOptions` to appear horizontally, use the `horizontal` prop on the `Listbox` component to enable navigating the options with the left and right arrow keys instead of up and down, and to update the `aria-orientation` attribute for assistive technologies.

    import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
    import { useState } from 'react'
    
    const people = [
      { id: 1, name: 'Durward Reynolds' },
      { id: 2, name: 'Kenton Towne' },
      { id: 3, name: 'Therese Wunsch' },
      { id: 4, name: 'Benedict Kessler' },
      { id: 5, name: 'Katelyn Rohan' },
    ]
    
    function Example() {
      const [selectedPerson, setSelectedPerson] = useState(people[0])
    
      return (
        <Listbox horizontal value={selectedPerson} onChange={setSelectedPerson}>      <ListboxButton>{selectedPerson.name}</ListboxButton>
          <ListboxOptions anchor="bottom" className="flex flex-row">        {people.map((person) => (
              <ListboxOption key={person.id} value={person} className="data-focus:bg-blue-100">
                {person.name}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </Listbox>
      )
    }
    

### [](#adding-transitions)

To animate the opening and closing of the listbox dropdown, add the `transition` prop to the `ListboxOptions` component and then use CSS to style the different stages of the transition:

    import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
    import { useState } from 'react'
    
    const people = [
      { id: 1, name: 'Durward Reynolds' },
      { id: 2, name: 'Kenton Towne' },
      { id: 3, name: 'Therese Wunsch' },
      { id: 4, name: 'Benedict Kessler' },
      { id: 5, name: 'Katelyn Rohan' },
    ]
    
    function Example() {
      const [selectedPerson, setSelectedPerson] = useState(people[0])
    
      return (
        <Listbox value={selectedPerson} onChange={setSelectedPerson}>
          <ListboxButton>{selectedPerson.name}</ListboxButton>
          <ListboxOptions
            anchor="bottom"
            transition        className="origin-top transition duration-200 ease-out data-closed:scale-95 data-closed:opacity-0"      >
            {people.map((person) => (
              <ListboxOption key={person.id} value={person} className="data-focus:bg-blue-100">
                {person.name}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </Listbox>
      )
    }
    

Internally, the `transition` prop is implemented in the exact same way as the `Transition` component. See the [Transition documentation](https://headlessui.com/react/transition) to learn more.

### [](#animating-with-framer-motion)

Headless UI also composes well with other animation libraries in the React ecosystem like [Framer Motion](https://www.framer.com/motion/) and [React Spring](https://www.react-spring.io/). You just need to expose some state to those libraries.

For example, to animate the listbox with Framer Motion, add the `static` prop to the `ListboxOptions` component and then conditionally render it based on the `open` render prop:

    import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
    import { AnimatePresence, motion } from 'framer-motion'
    import { useState } from 'react'
    
    const people = [
      { id: 1, name: 'Durward Reynolds' },
      { id: 2, name: 'Kenton Towne' },
      { id: 3, name: 'Therese Wunsch' },
      { id: 4, name: 'Benedict Kessler' },
      { id: 5, name: 'Katelyn Rohan' },
    ]
    
    function Example() {
      const [selectedPerson, setSelectedPerson] = useState(people[0])
    
      return (
        <Listbox value={selectedPerson} onChange={setSelectedPerson}>
          {({ open }) => (        <>
              <ListboxButton>{selectedPerson.name}</ListboxButton>
              <AnimatePresence>
                {open && (              <ListboxOptions
                    static                as={motion.div}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    anchor="bottom"
                    className="origin-top"
                  >
                    {people.map((person) => (
                      <ListboxOption key={person.id} value={person} className="data-focus:bg-blue-100">
                        {person.name}
                      </ListboxOption>
                    ))}
                  </ListboxOptions>
                )}          </AnimatePresence>
            </>
          )}    </Listbox>
      )
    }
    

### [](#binding-objects-as-values)

Unlike native HTML form controls, which only allow you to provide strings as values, Headless UI supports binding complex objects as well.

    import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
    import { useState } from 'react'
    
    const people = [  { id: 1, name: 'Durward Reynolds' },  { id: 2, name: 'Kenton Towne' },  { id: 3, name: 'Therese Wunsch' },  { id: 4, name: 'Benedict Kessler' },  { id: 5, name: 'Katelyn Rohan' },]
    function Example() {
      const [selectedPerson, setSelectedPerson] = useState(people[0])
    
      return (
        <Listbox value={selectedPerson} onChange={setSelectedPerson}>      <ListboxButton>{selectedPerson.name}</ListboxButton>
          <ListboxOptions anchor="bottom">
            {people.map((person) => (
              <ListboxOption key={person.id} value={person} className="data-focus:bg-blue-100">
                {person.name}          </ListboxOption>
            ))}
          </ListboxOptions>
        </Listbox>
      )
    }
    

When binding objects as values, it's important to make sure that you use the _same instance_ of the object as both the `value` of the `Listbox` as well as the corresponding `ListboxOption`, otherwise they will fail to be equal and cause the listbox to behave incorrectly.

To make it easier to work with different instances of the same object, you can use the `by` prop to compare the objects by a particular field instead of comparing object identity.

When you pass an object to the `value` prop, `by` will default to `id` when present, but you can set it to any field you like:

    import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
    
    const departments = [
      { name: 'Marketing', contact: 'Durward Reynolds' },
      { name: 'HR', contact: 'Kenton Towne' },
      { name: 'Sales', contact: 'Therese Wunsch' },
      { name: 'Finance', contact: 'Benedict Kessler' },
      { name: 'Customer service', contact: 'Katelyn Rohan' },
    ]
    
    function Example({ selectedDepartment, onChange }) {
      return (
        <Listbox value={selectedDepartment} by="name" onChange={onChange}>      <ListboxButton>{selectedDepartment.name}</ListboxButton>
          <ListboxOptions anchor="bottom">
            {departments.map((department) => (
              <ListboxOption key={department.name} value={department} className="data-focus:bg-blue-100">
                {department.name}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </Listbox>
      )
    }
    

You can also pass your own comparison function to the `by` prop if you'd like complete control over how objects are compared:

    import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
    
    const departments = [
      { id: 1, name: 'Marketing', contact: 'Durward Reynolds' },
      { id: 2, name: 'HR', contact: 'Kenton Towne' },
      { id: 3, name: 'Sales', contact: 'Therese Wunsch' },
      { id: 4, name: 'Finance', contact: 'Benedict Kessler' },
      { id: 5, name: 'Customer service', contact: 'Katelyn Rohan' },
    ]
    
    function compareDepartments(a, b) {  return a.name.toLowerCase() === b.name.toLowerCase()}
    function Example({ selectedDepartment, onChange }) {
      return (
        <Listbox value={selectedDepartment} by={compareDepartments} onChange={onChange}>      <ListboxButton>{selectedDepartment.name}</ListboxButton>
          <ListboxOptions anchor="bottom">
            {departments.map((department) => (
              <ListboxOption key={department.id} value={department} className="data-focus:bg-blue-100">
                {department.name}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </Listbox>
      )
    }
    

### [](#selecting-multiple-values)

To allow selecting multiple values in your listbox, use the `multiple` prop and pass an array to `value` instead of a single option.

    import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
    import { useState } from 'react'
    
    const people = [
      { id: 1, name: 'Durward Reynolds' },
      { id: 2, name: 'Kenton Towne' },
      { id: 3, name: 'Therese Wunsch' },
      { id: 4, name: 'Benedict Kessler' },
      { id: 5, name: 'Katelyn Rohan' },
    ]
    
    function Example() {
      const [selectedPeople, setSelectedPeople] = useState([people[0], people[1]])
      return (
        <Listbox value={selectedPeople} onChange={setSelectedPeople} multiple>      <ListboxButton>{selectedPeople.map((person) => person.name).join(', ')}</ListboxButton>
          <ListboxOptions anchor="bottom">
            {people.map((person) => (
              <ListboxOption key={person.id} value={person} className="data-focus:bg-blue-100">
                {person.name}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </Listbox>
      )
    }
    

This will keep the listbox open when you are selecting options, and choosing an option will toggle it in place.

Your `onChange` handler will be called with an array containing all selected options any time an option is added or removed.

### [](#rendering-as-different-elements)

By default, the `Listbox` and its subcomponents each render a default element that is sensible for that component.

For example, `ListboxButton` renders a `button`, `ListboxOptions` renders a `div`, and `ListboxOption` renders a `div`. By contrast, `Listbox` _does not render an element_, and instead renders its children directly.

Use the `as` prop to render the component as a different element or as your own custom component, making sure your custom components [forward refs](https://react.dev/reference/react/forwardRef) so that Headless UI can wire things up correctly.

    import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
    import { forwardRef, useState } from 'react'
    
    const people = [
      { id: 1, name: 'Durward Reynolds' },
      { id: 2, name: 'Kenton Towne' },
      { id: 3, name: 'Therese Wunsch' },
      { id: 4, name: 'Benedict Kessler' },
      { id: 5, name: 'Katelyn Rohan' },
    ]
    
    let MyCustomButton = forwardRef(function (props, ref) {  return <button className="..." ref={ref} {...props} />})
    function Example() {
      const [selectedPerson, setSelectedPerson] = useState(people[0])
    
      return (
        <Listbox value={selectedPerson} onChange={setSelectedPerson}>      <ListboxButton as={MyCustomButton}>{selectedPerson.name}</ListboxButton>      <ListboxOptions anchor="bottom" as="ul">
            {people.map((person) => (
              <ListboxOption as="li" key={person.id} value={person} className="data-focus:bg-blue-100">            {person.name}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </Listbox>
      )
    }
    

To tell an element to render its children directly with no wrapper element, use a `Fragment`.

    import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
    import { Fragment, useState } from 'react'
    
    const people = [
      { id: 1, name: 'Durward Reynolds' },
      { id: 2, name: 'Kenton Towne' },
      { id: 3, name: 'Therese Wunsch' },
      { id: 4, name: 'Benedict Kessler' },
      { id: 5, name: 'Katelyn Rohan' },
    ]
    
    function Example() {
      const [selectedPerson, setSelectedPerson] = useState(people[0])
    
      return (
        <Listbox value={selectedPerson} onChange={setSelectedPerson}>
          <ListboxButton as={Fragment}>        <button>{selectedPerson.name}</button>      </ListboxButton>      <ListboxOptions anchor="bottom">
            {people.map((person) => (
              <ListboxOption key={person.id} value={person} className="data-focus:bg-blue-100">
                {person.name}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </Listbox>
      )
    }
    

### [](#building-a-buttonless-api)

While the `ListboxButton` component is required when building custom listboxes, it's possible to build them in such a way that the button is included by default and therefore not required each time you use your listbox. For example, an API like this:

    <MyListbox name="status">
      <MyListboxOption value="active">Active</MyListboxOption>
      <MyListboxOption value="paused">Paused</MyListboxOption>
      <MyListboxOption value="delayed">Delayed</MyListboxOption>
      <MyListboxOption value="canceled">Canceled</MyListboxOption>
    </MyListbox>

To achieve this use the `ListboxSelectedOption` component within your `ListboxButton` to render the currently selected listbox option.

For this to work you must pass the `children` of your custom listbox (all the `ListboxOption` instances) to both the `ListboxOptions` as it's children as well as to the `ListboxSelectedOption` via the `options` prop.

Then, to style the `ListboxOption` based on whether it's being rendered in the `ListboxButton` or in the `ListboxOptions`, use the `selectedOption` render prop to conditionally apply different styles or render different content.

    import { Listbox, ListboxButton, ListboxOption, ListboxOptions, ListboxSelectedOption } from '@headlessui/react'
    import { Fragment, useState } from 'react'
    
    const people = [
      { id: 1, name: 'Durward Reynolds' },
      { id: 2, name: 'Kenton Towne' },
      { id: 3, name: 'Therese Wunsch' },
      { id: 4, name: 'Benedict Kessler' },
      { id: 5, name: 'Katelyn Rohan' },
    ]
    
    function Example() {
      const [selectedPerson, setSelectedPerson] = useState(people[0])
    
      return (
        <MyListbox value={selectedPerson} onChange={setSelectedPerson} placeholder="Select a person&hellip;">
          {people.map((person) => (
            <MyListboxOption key={person.id} value={person}>
              {person.name}
            </MyListboxOption>
          ))}
        </MyListbox>
      )
    }
    
    function MyListbox({ placeholder, children, ...props }) {
      return (
        <Listbox {...props}>
          <ListboxButton>
            <ListboxSelectedOption options={children} placeholder={<span className="opacity-50">{placeholder}</span>} />      </ListboxButton>
          <ListboxOptions anchor="bottom">{children}</ListboxOptions>    </Listbox>
      )
    }
    
    function MyListboxOption({ children, ...props }) {
      return (
        <ListboxOption as={Fragment} {...props}>
          {({ selectedOption }) => {        return selectedOption ? children : <div className="data-focus:bg-blue-100">{children}</div>      }}    </ListboxOption>
      )
    }
    

The `ListboxSelectedOption` component also has a `placeholder` prop that you can use to render a placeholder when no option is selected.

[](#keyboard-interaction)
-------------------------

[](#component-api)
------------------

### [](#listbox)

The main listbox component.

### [](#listbox-selected-option)

Renders the currently selected option, or a placeholder if no option is selected. Designed to be a child of `ListboxButton`.

### [](#listbox-options)

The component that directly wraps the list of options in your custom Listbox.

### [](#listbox-option)

Used to wrap each item within your Listbox.</content>
</page>

<page>
  <title>Headless UI</title>
  <url>https://headlessui.com/react/radio-group</url>
  <content>Radio groups give you the same functionality as native HTML radio inputs, without any of the styling. They're perfect for building out custom UIs for selectors.

[](#installation)
-----------------

To get started, install Headless UI via npm:

    npm install @headlessui/react

[](#basic-example)
------------------

Radio groups are built using the `RadioGroup`, `Radio`, `Field`, and `Label` components.

    import { Field, Label, Radio, RadioGroup } from '@headlessui/react'
    import { useState } from 'react'
    
    const plans = ['Startup', 'Business', 'Enterprise']
    
    function Example() {
      let [selected, setSelected] = useState(plans[0])
    
      return (
        <RadioGroup value={selected} onChange={setSelected} aria-label="Server size">
          {plans.map((plan) => (
            <Field key={plan} className="flex items-center gap-2">
              <Radio
                value={plan}
                className="group flex size-5 items-center justify-center rounded-full border bg-white data-checked:bg-blue-400"
              >
                <span className="invisible size-2 rounded-full bg-white group-data-checked:visible" />
              </Radio>
              <Label>{plan}</Label>
            </Field>
          ))}
        </RadioGroup>
      )
    }

[](#styling)
------------

Headless UI keeps track of a lot of state about each component, like which radio group option is currently checked, whether a popover is open or closed, or which item in a menu is currently focused via the keyboard.

But because the components are headless and completely unstyled out of the box, you can't see this information in your UI until you provide the styles you want for each state yourself.

### [](#using-data-attributes)

The easiest way to style the different states of a Headless UI component is using the `data-*` attributes that each component exposes.

For example, the `Radio` component exposes a `data-checked` attribute, which tells you if the radio is currently checked, and a `data-disabled` attribute, which tells you if the radio is currently disabled.

    <!-- Rendered `Radio` -->
    <span role="radio" data-checked data-disabled>
      <!-- ... -->
    </span>

Use the [CSS attribute selector](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors) to conditionally apply styles based on the presence of these data attributes. If you're using Tailwind CSS, the [data attribute modifier](https://tailwindcss.com/docs/hover-focus-and-other-states#data-attributes) makes this easy:

    import { Field, Label, Radio, RadioGroup } from '@headlessui/react'
    import { useState } from 'react'
    
    const plans = [
      { name: 'Startup', available: true },
      { name: 'Business', available: true },
      { name: 'Enterprise', available: false },
    ]
    
    function Example() {
      let [selected, setSelected] = useState(plans[0])
    
      return (
        <RadioGroup value={selected} onChange={setSelected} aria-label="Server size">
          {plans.map((plan) => (
            <Field key={plan.name} disabled={!plan.available} className="flex items-center gap-2">
              <Radio
                value={plan}
                className="group flex size-5 items-center justify-center rounded-full border bg-white data-checked:bg-blue-400 data-disabled:bg-gray-100"          >
                <span className="invisible size-2 rounded-full bg-white group-data-checked:visible" />          </Radio>
              <Label className="data-disabled:opacity-50">{plan.name}</Label>        </Field>
          ))}
        </RadioGroup>
      )
    }
    

### [](#using-render-props)

Each component also exposes information about its current state via [render props](https://reactjs.org/docs/render-props.html) that you can use to conditionally apply different styles or render different content.

For example, the `Radio` component exposes a `checked` state, which tells you if the radio is currently checked, and a `disabled` state, which tells you if the radio is currently disabled.

    import { Field, Label, Radio, RadioGroup } from '@headlessui/react'
    import clsx from 'clsx'
    import { Fragment, useState } from 'react'
    
    const plans = [
      { name: 'Startup', available: true },
      { name: 'Business', available: true },
      { name: 'Enterprise', available: false },
    ]
    
    function Example() {
      let [selected, setSelected] = useState(plans[0])
    
      return (
        <RadioGroup value={selected} onChange={setSelected} aria-label="Server size">
          {plans.map((plan) => (
            <Field key={plan.name} disabled={!plan.available} className="flex items-center gap-2">
              <Radio as={Fragment} value={plan}>            {({ checked, disabled }) => (              <span
                    className={clsx(
                      'group flex size-5 items-center justify-center rounded-full border',
                      checked ? 'bg-blue-400' : 'bg-white',                  disabled && 'bg-gray-100'                )}
                  >
                    {checked && <span className="size-2 rounded-full bg-white" />}              </span>
                )}
              </Radio>
              <Label as={Fragment}>            {({ disabled }) => <label className={disabled && 'opacity-50'}>{plan.name}</label>}          </Label>        </Field>
          ))}
        </RadioGroup>
      )
    }
    

See the [component API](#component-api) for a list of all the available render props.

[](#examples)
-------------

### [](#adding-a-description)

Use the `Description` component within a `Field` to automatically associate it with a `Radio` using the `aria-describedby` attribute:

    import { Description, Field, Label, Radio, RadioGroup } from '@headlessui/react'
    import { useState } from 'react'
    
    const plans = [
      { name: 'Startup', description: '12GB, 6 CPUs, 256GB SSD disk' },  { name: 'Business', description: '16GB, 8 CPUs, 512GB SSD disk' },  { name: 'Enterprise', description: '32GB, 12 CPUs, 1TB SSD disk' },]
    
    function Example() {
      let [selected, setSelected] = useState(plans[0])
    
      return (
        <RadioGroup value={selected} onChange={setSelected} aria-label="Server size">
          {plans.map((plan) => (
            <Field key={plan} className="flex items-baseline gap-2">
              <Radio
                value={plan}
                className="group flex size-5 items-center justify-center rounded-full border bg-white data-checked:bg-blue-400"
              >
                <span className="invisible size-2 rounded-full bg-white group-data-checked:visible" />
              </Radio>
              <div>
                <Label>{plan.name}</Label>
                <Description className="opacity-50">{plan.description}</Description>          </div>
            </Field>
          ))}
        </RadioGroup>
      )
    }
    

### [](#using-with-html-forms)

If you add the `name` prop to your `RadioGroup`, a hidden `input` element will be rendered and kept in sync with the radio group state.

    import { Field, Fieldset, Label, Legend, Radio, RadioGroup } from '@headlessui/react'
    import { useState } from 'react'
    
    const plans = ['Startup', 'Business', 'Enterprise']
    
    function Example() {
      const [selected, setSelected] = useState(plans[0])
    
      return (
        <form action="/plans" method="post">      <Fieldset>
            <Legend>Server size</Legend>
            <RadioGroup name="plan" value={selected} onChange={setSelected}>          {plans.map((plan) => (
                <Field key={plan}>
                  <Radio value={plan} />
                  <Label>{plan}</Label>
                </Field>
              ))}
            </RadioGroup>
          </Fieldset>
          <button>Submit</button>
        </form>  )
    }
    

This lets you use a radio group inside a native HTML `<form>` and make traditional form submissions as if your radio group was a native HTML form control.

Basic values like strings will be rendered as a single hidden input containing that value, but complex values like objects will be encoded into multiple inputs using square bracket notation for the names.

    <!-- Rendered hidden input -->
    <input type="hidden" name="plan" value="startup" />

### [](#using-as-uncontrolled)

If you omit the `value` prop, Headless UI will track its state internally for you, allowing you to use it as an [uncontrolled component](https://reactjs.org/docs/uncontrolled-components.html).

When uncontrolled, use the `defaultValue` prop to provide an initial value to the `RadioGroup`.

    import { useState } from 'react'
    import { RadioGroup, Radio, Fieldset, Legend, Field, Label } from '@headlessui/react'
    
    const plans = ['Startup', 'Business', 'Enterprise']
    
    function Example() {
      return (
        <form action="/plans" method="post">
          <Fieldset>
            <Legend>Server size</Legend>
            <RadioGroup name="plan" defaultValue={plans[0]}>          {plans.map((plan) => (
                <Field key={plan}>
                  <Radio value={plan} />
                  <Label>{plan}</Label>
                </Field>
              ))}
            </RadioGroup>
          </Fieldset>
        </form>
      )
    }
    

This can simplify your code when using the combobox [with HTML forms](#using-with-html-forms) or with form APIs that collect their state using [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData) instead of tracking it using React state.

Any `onChange` prop you provide will still be called when the component's value changes in case you need to run any side effects, but you won't need to use it to track the component's state yourself.

### [](#binding-objects-as-values)

Unlike native HTML form controls, which only allow you to provide strings as values, Headless UI supports binding complex objects as well.

    import { Field, Label, Radio, RadioGroup } from '@headlessui/react'
    import { useState } from 'react'
    
    const plans = [  { id: 1, name: 'Startup', available: true },  { id: 2, name: 'Business', available: true },  { id: 3, name: 'Enterprise', available: false },]
    function Example() {
      const [selected, setSelected] = useState(plans[0])
    
      return (
        <RadioGroup value={selected} onChange={setSelected} aria-label="Server size">      {plans.map((plan) => (
            <Field key={plan.id}>
              <Radio value={plan} disabled={!plan.available} />          <Label>{plan.name}</Label>
            </Field>
          ))}
        </RadioGroup>
      )
    }
    

When binding objects as values, it's important to make sure that you use the _same instance_ of the object as both the `value` of the `RadioGroup` as well as the corresponding `Radio`, otherwise they will fail to be equal and cause the radio group to behave incorrectly.

To make it easier to work with different instances of the same object, you can use the `by` prop to compare the objects by a particular field instead of comparing by object identity.

When you pass an object to the `value` prop, `by` will default to `id` when present, but you can set it to any field you like:

    import { Field, Label, Radio, RadioGroup } from '@headlessui/react'
    import { useState } from 'react'
    
    const plans = [
      { name: 'Startup', available: true },
      { name: 'Business', available: true },
      { name: 'Enterprise', available: false },
    ]
    
    function Example() {
      const [selected, setSelected] = useState(plans[0])
    
      return (
        <RadioGroup value={selected} by="name" onChange={setSelected} aria-label="Server size">      {plans.map((plan) => (
            <Field key={plan.id}>
              <Radio value={plan} disabled={!plan.available} />
              <Label>{plan.name}</Label>
            </Field>
          ))}
        </RadioGroup>
      )
    }
    

You can also pass your own comparison function to the `by` prop if you'd like complete control over how objects are compared:

    import { Field, Label, Radio, RadioGroup } from '@headlessui/react'
    import { useState } from 'react'
    
    const plans = [  { id: 1, name: 'Startup', available: true },  { id: 2, name: 'Business', available: true },  { id: 3, name: 'Enterprise', available: false },]
    function comparePlans(a, b) {  return a.name.toLowerCase() === b.name.toLowerCase()}
    function Example() {
      const [selected, setSelected] = useState(plans[0])
    
      return (
        <RadioGroup value={selected} by={comparePlans} onChange={setSelected} aria-label="Server size">      {plans.map((plan) => (
            <Field key={plan.id}>
              <Radio value={plan} disabled={!plan.available} />
              <Label>{plan.name}</Label>
            </Field>
          ))}
        </RadioGroup>
      )
    }
    

[](#keyboard-interaction)
-------------------------

All interactions apply when a `Radio` component is focused.

[](#component-api)
------------------

### [](#radio-group)

The main radio group component.

### [](#radio)

The component for each selectable option.</content>
</page>

<page>
  <title>Headless UI</title>
  <url>https://headlessui.com/react/select</url>
  <content>A light wrapper around the native select element that handles tedious accessibility concerns and provides more opinionated states for things like hover and focus.

[](#installation)
-----------------

To get started, install Headless UI via npm:

    npm install @headlessui/react

[](#basic-example)
------------------

Select controls are built using the `Select` component:

    import { Select } from '@headlessui/react'
    
    function Example() {
      return (
        <Select name="status" aria-label="Project status">
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="delayed">Delayed</option>
          <option value="canceled">Canceled</option>
        </Select>
      )
    }

You can pass any props to a `Select` that you'd normally pass to the native `select` element.

[](#styling)
------------

Headless UI keeps track of a lot of state about each component, like whether or not a select is focused, whether a popover is open or closed, or which item in a menu is currently focused via the keyboard.

But because the components are headless and completely unstyled out of the box, you can't see this information in your UI until you provide the styles you want for each state yourself.

### [](#using-data-attributes)

The easiest way to style the different states of a Headless UI component is using the `data-*` attributes that each component exposes.

For example, the `Select` component exposes a `data-focus` attribute, which tells you if the select is currently focused via keyboard, and a `data-hover` attribute, which tells you if the select is currently being hovered by the mouse.

    <!-- Rendered `Select` -->
    <select name="status" data-focus data-hover>
      <option value="active">Active</option>
      <option value="paused">Paused</option>
      <option value="delayed">Delayed</option>
      <option value="canceled">Canceled</option>
    </select>

Use the [CSS attribute selector](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors) to conditionally apply styles based on the presence of these data attributes. If you're using Tailwind CSS, the [data attribute modifier](https://tailwindcss.com/docs/hover-focus-and-other-states#data-attributes) makes this easy:

    import { Select } from '@headlessui/react'
    
    function Example() {
      return (
        <Select name="status" className="border data-focus:bg-blue-100 data-hover:shadow" aria-label="Project status">      <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="delayed">Delayed</option>
          <option value="canceled">Canceled</option>
        </Select>
      )
    }
    

See the [component API](#component-api) for a list of all the available data attributes.

### [](#using-render-props)

Each component also exposes information about its current state via [render props](https://reactjs.org/docs/render-props.html) that you can use to conditionally apply different styles or render different content.

For example, the `Select` component exposes a `focus` state, which tells you if the select is currently focused via the keyboard, and a `hover` state, which tells you if the select is currently being hovered by the mouse.

    import { Select } from '@headlessui/react'
    import clsx from 'clsx'
    import { Fragment } from 'react'
    
    function Example() {
      return (
        <Select name="status" as={Fragment}>
          {({ focus, hover }) => (        <select className={clsx('border', focus && 'bg-blue-100', hover && 'shadow')} aria-label="Project status">          <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="delayed">Delayed</option>
              <option value="canceled">Canceled</option>
            </select>
          )}    </Select>
      )
    }
    

See the [component API](#component-api) for a list of all the available render props.

[](#examples)
-------------

### [](#adding-a-label)

Wrap a `Label` and `Select` with the `Field` component to automatically associate them using a generated ID:

    import { Field, Label, Select } from '@headlessui/react'
    
    function Example() {
      return (
        <Field>      <Label>Project status</Label>      <Select name="status">
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="delayed">Delayed</option>
            <option value="canceled">Canceled</option>
          </Select>
        </Field>  )
    }
    

### [](#adding-a-description)

Use the `Description` component within a `Field` to automatically associate it with a `Select` using the `aria-describedby` attribute:

    import { Description, Field, Label, Select } from '@headlessui/react'
    
    function Example() {
      return (
        <Field>      <Label>Project status</Label>
          <Description>This will be visible to clients on the project.</Description>      <Select name="status">
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="delayed">Delayed</option>
            <option value="canceled">Canceled</option>
          </Select>
        </Field>  )
    }
    

### [](#disabling-a-select)

Add the `disabled` prop to the `Field` component to disable a `Select` and its associated `Label` and `Description`:

    import { Description, Field, Label, Select } from '@headlessui/react'
    
    function Example() {
      return (
        <Field disabled>      <Label className="data-disabled:opacity-50">Project status</Label>      <Description className="data-disabled:opacity-50">This will be visible to clients on the project.</Description>      <Select name="status" className="data-disabled:bg-gray-100">        <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="delayed">Delayed</option>
            <option value="canceled">Canceled</option>
          </Select>
        </Field>
      )
    }
    

You can also disable a select outside of a `Field` by adding the disabled prop directly to the `Select` itself.

[](#component-api)
------------------

### [](#select)

A thin wrapper around the native `select` element.

Groups a `Label`, `Description`, and form control together.

The `Label` component labels a form control.

The `Description` component describes a form control.</content>
</page>

<page>
  <title>Headless UI</title>
  <url>https://headlessui.com/v1</url>
  <content>[](https://headlessui.com/v1)[GitHub repository](https://github.com/tailwindlabs/headlessui)

Completely unstyled, fully accessible UI components, designed to integrate beautifully with Tailwind CSS.
---------------------------------------------------------------------------------------------------------

[React](https://headlessui.com/v1)[Vue](https://headlessui.com/v1/vue)

[Menu (Dropdown)](https://headlessui.com/v1/react/menu)

[Listbox (Select)](https://headlessui.com/v1/react/listbox)

[Combobox (Autocomplete)](https://headlessui.com/v1/react/combobox)

[Switch (Toggle)](https://headlessui.com/v1/react/switch)

[Disclosure](https://headlessui.com/v1/react/disclosure)

[Dialog (Modal)](https://headlessui.com/v1/react/dialog)

[Popover](https://headlessui.com/v1/react/popover)

[Radio Group](https://headlessui.com/v1/react/radio-group)

[Tabs](https://headlessui.com/v1/react/tabs)

[Transition](https://headlessui.com/v1/react/transition)</content>
</page>

<page>
  <title>Headless UI</title>
  <url>https://headlessui.com/react/textarea</url>
  <content>A light wrapper around the native textarea element that handles tedious accessibility concerns and provides more opinionated states for things like hover and focus.

[](#installation)
-----------------

To get started, install Headless UI via npm:

    npm install @headlessui/react

[](#basic-example)
------------------

Textareas are built using the `Textarea` component:

    import { Textarea } from '@headlessui/react'
    
    function Example() {
      return <Textarea name="description"></Textarea>
    }

You can pass any props to a `Textarea` that you'd normally pass to the native `textarea` element.

[](#styling)
------------

Headless UI keeps track of a lot of state about each component, like whether or not a textarea is focused, whether a popover is open or closed, or which item in a menu is currently focused via the keyboard.

But because the components are headless and completely unstyled out of the box, you can't see this information in your UI until you provide the styles you want for each state yourself.

### [](#using-data-attributes)

The easiest way to style the different states of a Headless UI component is using the `data-*` attributes that each component exposes.

For example, the `Textarea` component exposes a `data-focus` attribute, which tells you if the textarea is currently focused via the mouse or keyboard, and a `data-hover` attribute, which tells you if the textarea is currently being hovered by the mouse.

    <!-- Rendered `Textarea` -->
    <textarea name="description" data-focus data-hover></textarea>

Use the [CSS attribute selector](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors) to conditionally apply styles based on the presence of these data attributes. If you're using Tailwind CSS, the [data attribute modifier](https://tailwindcss.com/docs/hover-focus-and-other-states#data-attributes) makes this easy:

    import { Textarea } from '@headlessui/react'
    
    function Example() {
      return <Textarea name="description" className="border data-focus:bg-blue-100 data-hover:shadow"></Textarea>}
    

See the [component API](#component-api) for a list of all the available data attributes.

### [](#using-render-props)

Each component also exposes information about its current state via [render props](https://reactjs.org/docs/render-props.html) that you can use to conditionally apply different styles or render different content.

For example, the `Textarea` component exposes a `focus` state, which tells you if the textarea is currently focused via the mouse or keyboard, and a `hover` state, which tells you if the textarea is currently being hovered by the mouse.

    import { Textarea } from '@headlessui/react'
    import clsx from 'clsx'
    import { Fragment } from 'react'
    
    function Example() {
      return (
        <Textarea name="description" as={Fragment}>
          {({ focus, hover }) => (        <textarea className={clsx('border', focus && 'bg-blue-100', hover && 'shadow')}></textarea>      )}    </Textarea>
      )
    }
    

See the [component API](#component-api) for a list of all the available render props.

[](#examples)
-------------

### [](#adding-a-label)

Wrap a `Label` and `Textarea` with the `Field` component to automatically associate them using a generated ID:

    import { Field, Label, Textarea } from '@headlessui/react'
    
    function Example() {
      return (
        <Field>      <Label>Description</Label>      <Textarea name="description"></Textarea>
        </Field>  )
    }
    

### [](#adding-a-description)

Use the `Description` component within a `Field` to automatically associate it with a `Textarea` using the `aria-describedby` attribute:

    import { Description, Field, Label, Textarea } from '@headlessui/react'
    
    function Example() {
      return (
        <Field>      <Label>Description</Label>
          <Description>Add any extra information about your event here.</Description>      <Textarea name="description"></Textarea>
        </Field>  )
    }
    

### [](#disabling-a-textarea)

Add the `disabled` prop to the `Field` component to disable a `Textarea` and its associated `Label` and `Description`:

    import { Description, Field, Label, Textarea } from '@headlessui/react'
    
    function Example() {
      return (
        <Field disabled>      <Label className="data-disabled:opacity-50">Name</Label>
          <Description className="data-disabled:opacity-50">Add any extra information about your event here.</Description>
          <Textarea name="description" className="data-disabled:bg-gray-100"></Textarea>
        </Field>
      )
    }
    

You can also disable a textarea outside of a `Field` by adding the disabled prop directly to the `Textarea` itself.

[](#component-api)
------------------

### [](#textarea)

A thin wrapper around the native `textarea` element.

Groups a `Label`, `Description`, and form control together.

The `Label` component labels a form control.

The `Description` component describes a form control.</content>
</page>

<page>
  <title>Headless UI</title>
  <url>https://headlessui.com/react/switch</url>
  <content>Switches are a pleasant interface for toggling a value between two states, and offer the same semantics and keyboard navigation as native checkbox elements.

[](#installation)
-----------------

To get started, install Headless UI via npm:

    npm install @headlessui/react

[](#basic-example)
------------------

Switches are built using the `Switch` component. You can toggle your switch by clicking directly on the component, or by pressing the spacebar while it's focused.

Toggling the switch calls the `onChange` function with a negated version of the `checked` value.

    import { Switch } from '@headlessui/react'
    import { useState } from 'react'
    
    function Example() {
      const [enabled, setEnabled] = useState(false)
    
      return (
        <Switch
          checked={enabled}
          onChange={setEnabled}
          className="group inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition data-checked:bg-blue-600"
        >
          <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-6" />
        </Switch>
      )
    }

[](#styling)
------------

Headless UI keeps track of a lot of state about each component, like whether or not a switch is checked, whether a popover is open or closed, or which item in a menu is currently focused via the keyboard.

But because the components are headless and completely unstyled out of the box, you can't see this information in your UI until you provide the styles you want for each state yourself.

### [](#using-data-attributes)

The easiest way to style the different states of a Headless UI component is using the `data-*` attributes that each component exposes.

For example, the `Switch` component exposes a `data-checked` attribute, which tells you if the switch is currently checked, and a `data-disabled` attribute, which tells you if the switch is currently disabled.

    <!-- Rendered `Switch` -->
    <button data-checked data-disabled>
      <!-- ... -->
    </button>

Use the [CSS attribute selector](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors) to conditionally apply styles based on the presence of these data attributes. If you're using Tailwind CSS, the [data attribute modifier](https://tailwindcss.com/docs/hover-focus-and-other-states#data-attributes) makes this easy:

    import { Switch } from '@headlessui/react'
    import { useState } from 'react'
    
    function Example() {
      const [enabled, setEnabled] = useState(false)
    
      return (
        <Switch
          checked={enabled}
          onChange={setEnabled}
          className="group inline-flex h-6 w-11 items-center rounded-full bg-gray-200 data-checked:bg-blue-600 data-disabled:cursor-not-allowed data-disabled:opacity-50"    >
          <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-6" />    </Switch>
      )
    }
    

See the [component API](#component-api) for a list of all the available data attributes.

### [](#using-render-props)

Each component also exposes information about its current state via [render props](https://reactjs.org/docs/render-props.html) that you can use to conditionally apply different styles or render different content.

For example, the `Switch` component exposes a `checked` state, which tells you if the switch is currently checked, and a `disabled` state, which tells you if the switch is currently disabled.

    import { Switch } from '@headlessui/react'
    import clsx from 'clsx'
    import { Fragment, useState } from 'react'
    
    function Example() {
      const [enabled, setEnabled] = useState(false)
    
      return (
        <Switch checked={enabled} onChange={setEnabled} as={Fragment}>
          {({ checked, disabled }) => (        <button
              className={clsx(
                'group inline-flex h-6 w-11 items-center rounded-full',
                checked ? 'bg-blue-600' : 'bg-gray-200',            disabled && 'cursor-not-allowed opacity-50'          )}
            >
              <span className="sr-only">Enable notifications</span>
              <span
                className={clsx('size-4 rounded-full bg-white transition', checked ? 'translate-x-6' : 'translate-x-1')}          />
            </button>
          )}    </Switch>
      )
    }
    

See the [component API](#component-api) for a list of all the available render props.

[](#examples)
-------------

### [](#adding-a-label)

Wrap a `Label` and `Switch` with the `Field` component to automatically associate them using a generated ID:

    import { Field, Label, Switch } from '@headlessui/react'
    import { useState } from 'react'
    
    function Example() {
      const [enabled, setEnabled] = useState(false)
    
      return (
        <Field>      <Label>Enable notifications</Label>      <Switch
            checked={enabled}
            onChange={setEnabled}
            className="group inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition data-checked:bg-blue-600"
          >
            <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-6" />
          </Switch>
        </Field>  )
    }
    

By default, clicking the `Label` will toggle the `Switch`, just like labels do for native HTML checkboxes. If you'd like to make the `Label` non-clickable, you can add a `passive` prop to the `Label` component:

    <Label passive>Enable beta features</Label>

### [](#adding-a-description)

Use the `Description` component within a `Field` to automatically associate it with a `Switch` using the `aria-describedby` attribute:

    import { Description, Field, Label, Switch } from '@headlessui/react'
    import { useState } from 'react'
    
    function Example() {
      const [enabled, setEnabled] = useState(false)
    
      return (
        <Field>      <Label>Enable notifications</Label>
          <Description>Get notified about important changes in your projects.</Description>      <Switch
            checked={enabled}
            onChange={setEnabled}
            className="group inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition data-checked:bg-blue-600"
          >
            <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-6" />
          </Switch>
        </Field>  )
    }
    

### [](#disabling-a-switch)

Add the `disabled` prop to the `Field` component to disable a `Switch` and its associated `Label` and `Description`:

    import { Description, Field, Label, Switch } from '@headlessui/react'
    import { useState } from 'react'
    
    function Example() {
      const [enabled, setEnabled] = useState(false)
    
      return (
        <Field disabled>      <Label className="data-disabled:opacity-50">Enable notifications</Label>
          <Description className="data-disabled:opacity-50">
            Get notified about important changes in your projects.
          </Description>
          <Switch
            checked={enabled}
            onChange={setEnabled}
            className="group inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition data-checked:bg-blue-600 data-disabled:cursor-not-allowed data-disabled:opacity-50"
          >
            <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-6" />
          </Switch>
        </Field>
      )
    }
    

You can also disable a switch outside of a `Field` by adding the disabled prop directly to the `Switch` itself.

### [](#using-with-html-forms)

If you add the `name` prop to your `Switch`, a hidden `input` element will be rendered and kept in sync with the switch state.

    import { Switch } from '@headlessui/react'
    import { useState } from 'react'
    
    function Example() {
      const [enabled, setEnabled] = useState(false)
    
      return (
        <form action="/accounts" method="post">
          <Switch
            checked={enabled}
            onChange={setEnabled}
            name="terms-of-service"        className="group inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition data-checked:bg-blue-600"
          >
            <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-6" />
          </Switch>
          <button>Submit</button>
        </form>
      )
    }
    

This lets you use a switch inside a native HTML `<form>` and make traditional form submissions as if your switch was a native HTML form control.

By default, the value will be `on` when the switch is checked, and not present when the switch is unchecked.

    <!-- Rendered hidden input -->
    <input type="hidden" name="terms-of-service" value="on" />

You can customize the value if needed by using the `value` prop:

    import { Switch } from '@headlessui/react'
    import { useState } from 'react'
    
    function Example() {
      const [enabled, setEnabled] = useState(false)
    
      return (
        <form action="/accounts" method="post">
          <Switch
            checked={enabled}
            onChange={setEnabled}
            name="terms-of-service"
            value="accept"        className="group inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition data-checked:bg-blue-600"
          >
            <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-6" />
          </Switch>
          <button>Submit</button>
        </form>
      )
    }
    

The hidden input will then use your custom value when the switch is checked:

    <!-- Rendered hidden input -->
    <input type="hidden" name="terms-of-service" value="accept" />

Basic values like strings will be rendered as a single hidden input containing that value, but complex values like objects will be encoded into multiple inputs using a square bracket notation for the names.

### [](#using-as-uncontrolled)

If you omit the `checked` prop, Headless UI will track its state internally for you, allowing you to use it as an [uncontrolled component](https://reactjs.org/docs/uncontrolled-components.html).

When uncontrolled, you can check the `Switch` by default using the `defaultChecked` prop.

    import { Switch } from '@headlessui/react'
    
    function Example() {
      return (
        <form action="/accounts" method="post">
          <Switch
            defaultChecked={true}        name="terms-of-service"
            className="group inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition data-checked:bg-blue-600"
          >
            <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-6" />
          </Switch>
          <button>Submit</button>
        </form>
      )
    }
    

This can simplify your code when using the switch [with HTML forms](#using-with-html-forms) or with form APIs that collect their state using [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData) instead of tracking it using React state.

Any `onChange` prop you provide will still be called when the component's value changes in case you need to run any side effects, but you won't need to use it to track the component's state yourself.

### [](#adding-transitions)

Because switches are typically always rendered to the DOM (rather than being mounted/unmounted like other components), simple CSS transitions are often enough to animate your switch:

    import { Switch } from '@headlessui/react'
    import { useState } from 'react'
    
    function Example() {
      const [enabled, setEnabled] = useState(false)
    
      return (
        <Switch
          checked={enabled}
          onChange={setEnabled}
          className="group inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition data-checked:bg-blue-600"    >
          <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-6" />    </Switch>
      )
    }
    

Because they're renderless, Headless UI components also compose well with other animation libraries in the React ecosystem like [Framer Motion](https://www.framer.com/motion/) and [React Spring](https://www.react-spring.io/).

### [](#rendering-as-different-element)

The `Switch` component renders a `button` by default.

Use the `as` prop to render the component as a different element or as your own custom component, making sure your custom components [forward refs](https://react.dev/reference/react/forwardRef) so that Headless UI can wire things up correctly.

    import { Switch } from '@headlessui/react'
    import { useState } from 'react'
    
    function Example() {
      const [enabled, setEnabled] = useState(false)
    
      return (
        <Switch
          as="div"      checked={enabled}
          onChange={setEnabled}
          className="group inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition data-checked:bg-blue-600"
        >
          <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-6" />
        </Switch>
      )
    }
    

[](#keyboard-interaction)
-------------------------

[](#component-api)
------------------

### [](#switch)

The main switch component.

Groups a `Label`, `Description`, and form control together.

The `Label` component labels a form control.

The `Description` component describes a form control.</content>
</page>

<page>
  <title>Headless UI</title>
  <url>https://headlessui.com/v1/vue/menu</url>
  <content>Menus offer an easy way to build custom, accessible dropdown components with robust support for keyboard navigation.

[](#installation)
-----------------

To get started, install Headless UI via npm.

Please note that **this library only supports Vue 3**.

`npm install @headlessui/vue`

[](#basic-example)
------------------

Menu Buttons are built using the `Menu`, `MenuButton`, `MenuItems`, and `MenuItem` components.

The `MenuButton` will automatically open/close the `MenuItems` when clicked, and when the menu is open, the list of items receives focus and is automatically navigable via the keyboard.

`<template>   <Menu>     <MenuButton>More</MenuButton>     <MenuItems>       <MenuItem v-slot="{ active }">         <a :class='{ "bg-blue-500": active }' href="/account-settings">           Account settings         </a>       </MenuItem>       <MenuItem v-slot="{ active }">         <a :class='{ "bg-blue-500": active }' href="/account-settings">           Documentation         </a>       </MenuItem>       <MenuItem disabled>         <span class="opacity-75">Invite a friend (coming soon!)</span>       </MenuItem>     </MenuItems>   </Menu> </template>  <script setup>   import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue' </script>`

[](#styling-different-states)
-----------------------------

Headless UI keeps track of a lot of state about each component, like which listbox option is currently selected, whether a popover is open or closed, or which item in a menu is currently active via the keyboard.

But because the components are headless and completely unstyled out of the box, you can't _see_ this information in your UI until you provide the styles you want for each state yourself.

### [](#using-slots)

Each component exposes information about its current state via [slot props](https://vuejs.org/api/built-in-directives.html#v-slot) that you can use to conditionally apply different styles or render different content.

For example, the `MenuItem` component exposes an `active` state, which tells you if the item is currently focused via the mouse or keyboard.

``<template>   <Menu>     <MenuButton>Options</MenuButton>     <MenuItems>       <!-- Use the `active` state to conditionally style the active item. -->       <MenuItem         v-for="link in links"         :key="link.href"         as="template"``

        `v-slot="{ active }"`

      `>         <a           :href="link.href"              :class="{ 'bg-blue-500 text-white': active, 'bg-white text-black': !active }"          >           {{ link.label }}         </a>       </MenuItem>     </MenuItems>   </Menu> </template>  <script setup>   import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'    const links = [     { href: '/account-settings', label: 'Account settings' },     { href: '/support', label: 'Support' },     { href: '/license', label: 'License' },     { href: '/sign-out', label: 'Sign out' },   ] </script>`

For a complete list of all the available slot props, see the [component API documentation](#component-api).

### [](#using-data-attributes)

Each component also exposes information about its current state via a `data-headlessui-state` attribute that you can use to conditionally apply different styles.

When any of the states in the [slot prop API](#component-api) are `true`, they will be listed in this attribute as space-separated strings so you can target them with a [CSS attribute selector](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors) in the form `[attr~=value]`.

For example, here's what the `MenuItems` component with some child `MenuItem` components renders when the menu is open and the second item is `active`:

``<!-- Rendered `MenuItems` --> <ul data-headlessui-state="open">   <li data-headlessui-state="">Account settings</li>   <li data-headlessui-state="active">Support</li>   <li data-headlessui-state="">License</li> </ul>``

If you are using [Tailwind CSS](https://tailwindcss.com/), you can use the [@headlessui/tailwindcss](https://github.com/tailwindlabs/headlessui/tree/main/packages/%40headlessui-tailwindcss) plugin to target this attribute with modifiers like `ui-open:*` and `ui-active:*`:

``<template>   <Menu>     <MenuButton>Options</MenuButton>     <MenuItems>       <!-- Use the `active` state to conditionally style the active item. -->       <MenuItem         v-for="link in links"         :key="link.href"         :href="link.href"         as="a"``

        `class="ui-active:bg-blue-500 ui-active:text-white ui-not-active:bg-white ui-not-active:text-black"`

      `>         {{ link.label }}       </MenuItem>     </MenuItems>   </Menu> </template>  <script setup>   import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'    const links = [     { href: '/account-settings', label: 'Account settings' },     { href: '/support', label: 'Support' },     { href: '/license', label: 'License' },     { href: '/sign-out', label: 'Sign out' },   ] </script>`

By default, your `MenuItems` instance will be shown/hidden automatically based on the internal `open` state tracked within the `Menu` component itself.

``<template>   <Menu>     <MenuButton>More</MenuButton>      <!--       By default, the `MenuItems` will automatically show/hide       when the `MenuButton` is pressed.     -->     <MenuItems>       <MenuItem><!-- ... --></MenuItem>       <!-- ... -->     </MenuItems>   </Menu> </template>  <script setup>   import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue' </script>``

If you'd rather handle this yourself (perhaps because you need to add an extra wrapper element for one reason or another), you can add a `static` prop to the `MenuItems` instance to tell it to always render, and inspect the `open` slot prop provided by the `Menu` to control which element is shown/hidden yourself.

`<template>`

  `<Menu v-slot="{ open }">`

    ``<MenuButton>More</MenuButton>        <div v-show="open">        <!--         Using the `static` prop, the `MenuItems` are always         rendered and the `open` state is ignored.       -->          <MenuItems static>          <MenuItem><!-- ... --></MenuItem>         <!-- ... -->       </MenuItems>     </div>   </Menu> </template>  <script setup>   import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue' </script>``

The menu will already close by default, however it can happen that 3rd party `Link` components use `event.preventDefault()`, which prevents the default behaviour and therefore won't close the menu.

The `Menu` and `MenuItem` expose a `close()` slot prop which you can use to imperatively close the menu:

`<template>   <Menu>     <MenuButton>Terms</MenuButton>      <MenuItems>`

      `<MenuItem v-slot="{ close }">`

        `<MyCustomLink href="/" @click="close">Read and accept</MyCustomLink>`

      `</MenuItem>     </MenuItems>   </Menu> </template>  <script setup>   import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'   import { MyCustomLink } from './MyCustomLink' </script>`

[](#disabling-an-item)
----------------------

Use the `disabled` prop to disable a `MenuItem`. This will make it unselectable via keyboard navigation, and it will be skipped when pressing the up/down arrows.

`<template>   <Menu>     <MenuButton>More</MenuButton>      <MenuItems>       <!-- ... -->        <!-- This item will be skipped by keyboard navigation. -->`

      `<MenuItem disabled>`

        `<span class="opacity-75">Invite a friend (coming soon!)</span>       </MenuItem>     </MenuItems>   </Menu> </template>  <script setup>   import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue' </script>`

[](#transitions)
----------------

To animate the opening/closing of the menu panel, you can use Vue's built-in `<transition>` component. All you need to do is wrap your `MenuItems` instance in a `<transition>`, and the transition will be applied automatically.

``<template>   <Menu>     <MenuButton>More</MenuButton>      <!-- Use Vue's built-in `transition` element to add transitions. -->``

    `<transition`

      `enter-active-class="transition duration-100 ease-out"`

      `enter-from-class="transform scale-95 opacity-0"`

      `enter-to-class="transform scale-100 opacity-100"`

      `leave-active-class="transition duration-75 ease-out"`

      `leave-from-class="transform scale-100 opacity-100"`

      `leave-to-class="transform scale-95 opacity-0"`

    `>`

      `<MenuItems>         <MenuItem><!-- ... --></MenuItem>          <!-- ... -->       </MenuItems>     </transition>   </Menu> </template>  <script setup>   import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue' </script>`

If you'd like to coordinate multiple transitions for different children of your Menu, check out the [Transition component included in Headless UI](https://headlessui.com/v1/vue/transition).

[](#rendering-additional-content)
---------------------------------

The accessibility semantics of `role="menu"` are fairly strict and any children of a `Menu` that are not `MenuItem` components will be automatically hidden from assistive technology to make sure the menu works the way screen reader users expect.

For this reason, rendering any children other than `MenuItem` components is discouraged as that content will be inaccessible to people using assistive technology.

If you want to build a dropdown with more flexible content, consider using [Popover](https://headlessui.com/v1/vue/popover) instead.

[](#rendering-as-different-elements)
------------------------------------

By default, the `Menu` and its subcomponents each render a default element that is sensible for that component.

For example, `MenuButton` renders a `button` by default, and `MenuItems` renders a `div`. By contrast, `Menu` and `MenuItem` _do not render an element_, and instead render their children directly by default.

This is easy to change using the `as` prop, which exists on every component.

``<template>   <!-- Render a `div` instead of no wrapper element -->``

  `<Menu as="div">`

    ``<MenuButton>More</MenuButton>      <!-- Render a `section` instead of a `div` -->        <MenuItems as="section">        <MenuItem v-slot="{ active }">         <a :class='{ "bg-blue-500": active }' href="/account-settings">           Account settings         </a>       </MenuItem>        <!-- ... -->     </MenuItems>   </Menu> </template>  <script setup>   import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue' </script>``

To tell an element to render its children directly with no wrapper element, use `as="template"`.

``<template>   <Menu>     <!-- Render no wrapper, instead pass in a `button` manually. -->``

    `<MenuButton as="template">`

      `<button>More</button>     </MenuButton>     <MenuItems>       <MenuItem v-slot="{ active }">         <a :class='{ "bg-blue-500": active }' href="/account-settings">           Account settings         </a>       </MenuItem>       <!-- ... -->     </MenuItems>   </Menu> </template>  <script setup>   import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue' </script>`

This is important if you are using an interactive element like an `<a>` tag inside the `MenuItem`. If the `MenuItem` had an `as="div"`, then the props provided by Headless UI would be forwarded to the `div` instead of the `a`, which means that you can't go to the URL provided by the `<a>` tag anymore via your keyboard.

[](#accessibility-notes)
------------------------

### [](#focus-management)

Clicking the `MenuButton` toggles the menu and focuses the `MenuItems` component. Focus is trapped within the open menu until Escape is pressed or the user clicks outside the menu. Closing the menu returns focus to the `MenuButton`.

### [](#mouse-interaction)

Clicking a `MenuButton` toggles the menu. Clicking anywhere outside of an open menu will close that menu.

### [](#keyboard-interaction)

### [](#other)

All relevant ARIA attributes are automatically managed.

For a full reference on all accessibility features implemented in `Menu`, see [the ARIA spec on Menu Buttons](https://www.w3.org/TR/wai-aria-practices-1.2/#menubutton).

Menus are best for UI elements that resemble things like the menus you'd find in the title bar of most operating systems. They have specific accessibility semantics, and their content should be restricted to a list of links or buttons. Focus is trapped in an open menu, so you cannot Tab through the content or away from the menu. Instead, the arrow keys navigate through a Menu's items.

Here's when you might use other similar components from Headless UI:

*   **`<Popover />`**. Popovers are general-purpose floating menus. They appear near the button that triggers them, and you can put arbitrary markup in them like images or non-clickable content. The Tab key navigates the contents of a Popover like it would any other normal markup. They're great for building header nav items with expandable content and flyout panels.
    
*   **`<Disclosure />`**. Disclosures are useful for elements that expand to reveal additional information, like a toggleable FAQ section. They are typically rendered inline and reflow the document when they're shown or hidden.
    
*   **`<Dialog />`**. Dialogs are meant to grab the user's full attention. They typically render a floating panel in the center of the screen, and use a backdrop to dim the rest of the application's contents. They also capture focus and prevent tabbing away from the Dialog's contents until the Dialog is dismissed.
    

[](#component-api)
------------------</content>
</page>

<page>
  <title>Headless UI</title>
  <url>https://headlessui.com/v1/vue/listbox</url>
  <content>Listboxes are a great foundation for building custom, accessible select menus for your app, complete with robust support for keyboard navigation.

[](#installation)
-----------------

To get started, install Headless UI via npm.

Please note that **this library only supports Vue 3**.

`npm install @headlessui/vue`

[](#basic-example)
------------------

Listboxes are built using the `Listbox`, `ListboxButton`, `ListboxOptions`, `ListboxOption` and `ListboxLabel` components.

The `ListboxButton` will automatically open/close the `ListboxOptions` when clicked, and when the menu is open, the list of items receives focus and is automatically navigable via the keyboard.

`<template>   <Listbox v-model="selectedPerson">     <ListboxButton>{{ selectedPerson.name }}</ListboxButton>     <ListboxOptions>       <ListboxOption         v-for="person in people"         :key="person.id"         :value="person"         :disabled="person.unavailable"       >         {{ person.name }}       </ListboxOption>     </ListboxOptions>   </Listbox> </template>  <script setup>   import { ref } from 'vue'   import {     Listbox,     ListboxButton,     ListboxOptions,     ListboxOption,   } from '@headlessui/vue'    const people = [     { id: 1, name: 'Durward Reynolds', unavailable: false },     { id: 2, name: 'Kenton Towne', unavailable: false },     { id: 3, name: 'Therese Wunsch', unavailable: false },     { id: 4, name: 'Benedict Kessler', unavailable: true },     { id: 5, name: 'Katelyn Rohan', unavailable: false },   ]   const selectedPerson = ref(people[0]) </script>`

[](#styling-different-states)
-----------------------------

Headless UI keeps track of a lot of state about each component, like which listbox option is currently selected, whether a popover is open or closed, or which item in a listbox is currently active via the keyboard.

But because the components are headless and completely unstyled out of the box, you can't _see_ this information in your UI until you provide the styles you want for each state yourself.

### [](#using-slots)

Each component exposes information about its current state via [slot props](https://vuejs.org/api/built-in-directives.html#v-slot) that you can use to conditionally apply different styles or render different content.

For example, the `ListboxOption` component exposes an `active` state, which tells you if the item is currently focused via the mouse or keyboard.

``<template>   <Listbox v-model="selectedPerson">     <ListboxButton>{{ selectedPerson.name }}</ListboxButton>     <ListboxOptions>       <!-- Use the `active` state to conditionally style the active option. -->       <!-- Use the `selected` state to conditionally style the selected option. -->       <ListboxOption         v-for="person in people"         :key="person.id"         :value="person"         as="template"``

        `v-slot="{ active, selected }"`

      `>         <li           :class="{              'bg-blue-500 text-white': active,              'bg-white text-black': !active,            }"         >              <CheckIcon v-show="selected" />            {{ person.name }}         </li>       </ListboxOption>     </ListboxOptions>   </Listbox> </template>  <script setup>   import { ref } from 'vue'   import {     Listbox,     ListboxButton,     ListboxOptions,     ListboxOption,   } from '@headlessui/vue'   import { CheckIcon } from '@heroicons/vue/20/solid'    const people = [     { id: 1, name: 'Durward Reynolds' },     { id: 2, name: 'Kenton Towne' },     { id: 3, name: 'Therese Wunsch' },     { id: 4, name: 'Benedict Kessler' },     { id: 5, name: 'Katelyn Rohan' },   ]   const selectedPerson = ref(people[0]) </script>`

For a complete list of all the available slot props, see the [component API documentation](#component-api).

### [](#using-data-attributes)

Each component also exposes information about its current state via a `data-headlessui-state` attribute that you can use to conditionally apply different styles.

When any of the states in the [slot prop API](#component-api) are `true`, they will be listed in this attribute as space-separated strings so you can target them with a [CSS attribute selector](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors) in the form `[attr~=value]`.

For example, here's what the `ListboxOptions` component with some child `ListboxOption` components renders when the listbox is open and the second item is `active`:

``<!-- Rendered `ListboxOptions` --> <ul data-headlessui-state="open">   <li data-headlessui-state="">Wade Cooper</li>   <li data-headlessui-state="active selected">Arlene Mccoy</li>   <li data-headlessui-state="">Devon Webb</li> </ul>``

If you are using [Tailwind CSS](https://tailwindcss.com/), you can use the [@headlessui/tailwindcss](https://github.com/tailwindlabs/headlessui/tree/main/packages/%40headlessui-tailwindcss) plugin to target this attribute with modifiers like `ui-open:*` and `ui-active:*`:

`<template>   <Listbox v-model="selectedPerson">     <ListboxButton>{{ selectedPerson.name }}</ListboxButton>     <ListboxOptions>       <ListboxOption         v-for="person in people"         :key="person.id"         :value="person"`

        `class="ui-active:bg-blue-500 ui-active:text-white ui-not-active:bg-white ui-not-active:text-black"`

      `>            <CheckIcon class="hidden ui-selected:block" />          {{ person.name }}       </ListboxOption>     </ListboxOptions>   </Listbox> </template>  <script setup>   import { ref } from 'vue'   import {     Listbox,     ListboxButton,     ListboxOptions,     ListboxOption,   } from '@headlessui/vue'   import { CheckIcon } from '@heroicons/vue/20/solid'    const people = [     { id: 1, name: 'Durward Reynolds' },     { id: 2, name: 'Kenton Towne' },     { id: 3, name: 'Therese Wunsch' },     { id: 4, name: 'Benedict Kessler' },     { id: 5, name: 'Katelyn Rohan' },   ]   const selectedPerson = ref(people[0]) </script>`

[](#binding-objects-as-values)
------------------------------

Unlike native HTML form controls which only allow you to provide strings as values, Headless UI supports binding complex objects as well.

`<template>`

  `<Listbox v-model="selectedPerson">`

    `<ListboxButton>{{ selectedPerson.name }}</ListboxButton>     <ListboxOptions>       <ListboxOption         v-for="person in people"         :key="person.id"            :value="person"          :disabled="person.unavailable"       >         {{ person.name }}       </ListboxOption>     </ListboxOptions>   </Listbox> </template>  <script setup>   import { ref } from 'vue'   import {     Listbox,     ListboxButton,     ListboxOptions,     ListboxOption,   } from '@headlessui/vue'      const people = [        { id: 1, name: 'Durward Reynolds', unavailable: false },        { id: 2, name: 'Kenton Towne', unavailable: false },        { id: 3, name: 'Therese Wunsch', unavailable: false },        { id: 4, name: 'Benedict Kessler', unavailable: true },        { id: 5, name: 'Katelyn Rohan', unavailable: false },      ]    const selectedPerson = ref(people[1]) </script>`

When binding objects as values, it's important to make sure that you use the _same instance_ of the object as both the `value` of the `Listbox` as well as the corresponding `ListboxOption`, otherwise they will fail to be equal and cause the listbox to behave incorrectly.

To make it easier to work with different instances of the same object, you can use the `by` prop to compare the objects by a particular field instead of comparing object identity:

`<template>   <Listbox     :modelValue="modelValue"     @update:modelValue="value => emit('update:modelValue', value)"`

    `by="id"`

  `>     <ListboxButton>{{ modelValue.name }}</ListboxButton>     <ListboxOptions>       <ListboxOption         v-for="department in departments"         :key="department.id"         :value="department"       >         {{ department.name }}       </ListboxOption>     </ListboxOptions>   </Listbox> </template>  <script setup>   import {     Listbox,     ListboxButton,     ListboxOptions,     ListboxOption,   } from '@headlessui/vue'    const props = defineProps({ modelValue: Object })   const emit = defineEmits(['update:modelValue'])    const departments = [     { id: 1, name: 'Marketing', contact: 'Durward Reynolds' },     { id: 2, name: 'HR', contact: 'Kenton Towne' },     { id: 3, name: 'Sales', contact: 'Therese Wunsch' },     { id: 4, name: 'Finance', contact: 'Benedict Kessler' },     { id: 5, name: 'Customer service', contact: 'Katelyn Rohan' },   ] </script>`

You can also pass your own comparison function to the `by` prop if you'd like complete control over how objects are compared:

`<template>   <Listbox     :modelValue="modelValue"     @update:modelValue="value => emit('update:modelValue', value)"`

    `:by="compareDepartments"`

  `>     <ListboxButton>{{ modelValue.name }}</ListboxButton>     <ListboxOptions>       <ListboxOption         v-for="department in departments"         :key="department.id"         :value="department"       >         {{ department.name }}       </ListboxOption>     </ListboxOptions>   </Listbox> </template>  <script setup>   import {     Listbox,     ListboxButton,     ListboxOptions,     ListboxOption,   } from '@headlessui/vue'    const props = defineProps({ modelValue: Object })   const emit = defineEmits(['update:modelValue'])      function compareDepartments(a, b) {        return a.name.toLowerCase() === b.name.toLowerCase()      }    const departments = [     { id: 1, name: 'Marketing', contact: 'Durward Reynolds' },     { id: 2, name: 'HR', contact: 'Kenton Towne' },     { id: 3, name: 'Sales', contact: 'Therese Wunsch' },     { id: 4, name: 'Finance', contact: 'Benedict Kessler' },     { id: 5, name: 'Customer service', contact: 'Katelyn Rohan' },   ] </script>`

[](#selecting-multiple-values)
------------------------------

To allow selecting multiple values in your listbox, use the `multiple` prop and pass an array to `v-model` instead of a single option.

`<template>`

  `<Listbox v-model="selectedPeople" multiple>`

    `<ListboxButton>       {{ selectedPeople.map((person) => person.name).join(', ') }}     </ListboxButton>     <ListboxOptions>       <ListboxOption v-for="person in people" :key="person.id" :value="person">         {{ person.name }}       </ListboxOption>     </ListboxOptions>   </Listbox> </template>  <script setup>   import { ref } from 'vue'   import {     Listbox,     ListboxButton,     ListboxOptions,     ListboxOption,   } from '@headlessui/vue'    const people = [     { id: 1, name: 'Durward Reynolds' },     { id: 2, name: 'Kenton Towne' },     { id: 3, name: 'Therese Wunsch' },     { id: 4, name: 'Benedict Kessler' },     { id: 5, name: 'Katelyn Rohan' },   ]      const selectedPeople = ref([people[0], people[1]])</script>`

This will keep the listbox open when you are selecting options, and choosing an option will toggle it in place.

Your `v-model` binding will be updated with an array containing all selected options any time an option is added or removed.

[](#using-a-custom-label)
-------------------------

By default the `Listbox` will use the button contents as the label for screenreaders. If you'd like more control over what is announced to assistive technologies, use the `ListboxLabel` component.

`<template>   <Listbox v-model="selectedPerson">`

    `<ListboxLabel>Assignee:</ListboxLabel>`

    `<ListboxButton>{{ selectedPerson.name }}</ListboxButton>     <ListboxOptions>       <ListboxOption v-for="person in people" :key="person.id" :value="person">         {{ person.name }}       </ListboxOption>     </ListboxOptions>   </Listbox> </template>  <script setup>   import { ref } from 'vue'   import {     Listbox,     ListboxLabel,     ListboxButton,     ListboxOptions,     ListboxOption,   } from '@headlessui/vue'    const people = [     { id: 1, name: 'Durward Reynolds' },     { id: 2, name: 'Kenton Towne' },     { id: 3, name: 'Therese Wunsch' },     { id: 4, name: 'Benedict Kessler' },     { id: 5, name: 'Katelyn Rohan' },   ]   const selectedPerson = ref(people[0]) </script>`

[](#using-with-html-forms)
--------------------------

If you add the `name` prop to your listbox, hidden `input` elements will be rendered and kept in sync with your selected value.

`<template>   <form action="/projects/1/assignee" method="post">`

    `<Listbox v-model="selectedPerson" name="assignee">`

      `<ListboxButton>{{ selectedPerson.name }}</ListboxButton>       <ListboxOptions>         <ListboxOption           v-for="person in people"           :key="person.id"           :value="person"         >           {{ person.name }}         </ListboxOption>       </ListboxOptions>     </Listbox>     <button>Submit</button>   </form> </template>  <script setup>   import { ref } from 'vue'   import {     Listbox,     ListboxButton,     ListboxOptions,     ListboxOption,   } from '@headlessui/vue'    const people = [     { id: 1, name: 'Durward Reynolds' },     { id: 2, name: 'Kenton Towne' },     { id: 3, name: 'Therese Wunsch' },     { id: 4, name: 'Benedict Kessler' },     { id: 5, name: 'Katelyn Rohan' },   ]   const selectedPerson = ref(people[0]) </script>`

This lets you use a listbox inside a native HTML `<form>` and make traditional form submissions as if your listbox was a native HTML form control.

Basic values like strings will be rendered as a single hidden input containing that value, but complex values like objects will be encoded into multiple inputs using a square bracket notation for the names:

`<input type="hidden" name="assignee[id]" value="1" /> <input type="hidden" name="assignee[name]" value="Durward Reynolds" />`

[](#using-as-an-uncontrolled-component)
---------------------------------------

If you provide a `defaultValue` prop to the `Listbox` instead of a `value`, Headless UI will track its state internally for you, allowing you to use it as an [uncontrolled component](https://reactjs.org/docs/uncontrolled-components.html).

You can access the currently selected option via the `value` slot prop on the `Listbox` and `ListboxButton` components.

`<template>   <form action="/projects/1/assignee" method="post">`

    `<Listbox name="assignee" :defaultValue="people[0]">`

      `<ListboxButton v-slot="{ value }">{{ value.name }}</ListboxButton>`

      `<ListboxOptions>         <ListboxOption           v-for="person in people"           :key="person.id"           :value="person"         >           {{ person.name }}         </ListboxOption>       </ListboxOptions>     </Listbox>     <button>Submit</button>   </form> </template>  <script setup>   import {     Listbox,     ListboxButton,     ListboxOptions,     ListboxOption,   } from '@headlessui/vue'    const people = [     { id: 1, name: 'Durward Reynolds' },     { id: 2, name: 'Kenton Towne' },     { id: 3, name: 'Therese Wunsch' },     { id: 4, name: 'Benedict Kessler' },     { id: 5, name: 'Katelyn Rohan' },   ] </script>`

This can simplify your code when using the listbox [with HTML forms](#using-with-html-forms) or with form APIs that collect their state using [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData) instead of tracking it using React state.

Any `@update:modelValue` prop you provide will still be called when the component's value changes in case you need to run any side effects, but you won't need to use it to track the component's state yourself.

[](#showing-hiding-the-listbox)
-------------------------------

By default, your `ListboxOptions` instance will be shown/hidden automatically based on the internal `open` state tracked within the `Listbox` component itself.

``<template>   <Listbox v-model="selectedPerson">     <ListboxButton>{{ selectedPerson.name }}</ListboxButton>      <!--       By default, the `ListboxOptions` will automatically show/hide       when the `ListboxButton` is pressed.     -->     <ListboxOptions>       <ListboxOption v-for="person in people" :key="person.id" :value="person">         {{ person.name }}       </ListboxOption>     </ListboxOptions>   </Listbox> </template>  <script setup>   import { ref } from 'vue'   import {     Listbox,     ListboxButton,     ListboxOptions,     ListboxOption,   } from '@headlessui/vue'    const people = [     { name: 'Durward Reynolds' },     { name: 'Kenton Towne' },     { name: 'Therese Wunsch' },     { name: 'Benedict Kessler' },     { name: 'Katelyn Rohan' },   ]   const selectedPerson = ref(people[0]) </script>``

If you'd rather handle this yourself (perhaps because you need to add an extra wrapper element for one reason or another), you can add a `static` prop to the `ListboxOptions` instance to tell it to always render, and inspect the `open` slot prop provided by the `Listbox` to control which element is shown/hidden yourself.

`<template>`

  `<Listbox v-model="selectedPerson" v-slot="{ open }">`

    ``<ListboxButton>{{ selectedPerson.name }}</ListboxButton>        <div v-show="open">        <!--         Using the `static` prop, the `ListboxOptions` are always         rendered and the `open` state is ignored.       -->          <ListboxOptions static>          <ListboxOption           v-for="person in people"           :key="person.id"           :value="person"         >           {{ person.name }}         </ListboxOption>       </ListboxOptions>     </div>   </Listbox> </template>  <script setup>   import { ref } from 'vue'   import {     Listbox,     ListboxButton,     ListboxOptions,     ListboxOption,   } from '@headlessui/vue'    const people = [     { name: 'Durward Reynolds' },     { name: 'Kenton Towne' },     { name: 'Therese Wunsch' },     { name: 'Benedict Kessler' },     { name: 'Katelyn Rohan' },   ]   const selectedPerson = ref(people[0]) </script>``

[](#disabling-an-option)
------------------------

Use the `disabled` prop to disable a `ListboxOption`. This will make it unselectable via mouse and keyboard, and it will be skipped when pressing the up/down arrows.

`<template>   <Listbox v-model="selectedPerson">     <ListboxButton>{{ selectedPerson.name }}</ListboxButton>      <ListboxOptions>       <!-- Disabled options will be skipped by keyboard navigation. -->       <ListboxOption         v-for="person in people"         :key="person.name"         :value="person"`

        `:disabled="person.unavailable"`

      `>         <span :class='{ "opacity-75": person.unavailable }'>           {{ person.name }}         </span>       </ListboxOption>     </ListboxOptions>   </Listbox> </template>  <script setup>   import { ref } from 'vue'   import {     Listbox,     ListboxButton,     ListboxOptions,     ListboxOption,   } from '@headlessui/vue'    const people = [     { name: 'Durward Reynolds', unavailable: true },     { name: 'Kenton Towne', unavailable: false },     { name: 'Therese Wunsch', unavailable: false },     { name: 'Benedict Kessler', unavailable: true },     { name: 'Katelyn Rohan', unavailable: false },   ]   const selectedPerson = ref(people[0]) </script>`

[](#transitions)
----------------

To animate the opening/closing of your listbox, you can use Vue's built-in `<transition>` component. All you need to do is wrap your `ListboxOptions` instance in a `<transition>`, and the transition will be applied automatically.

``<template>   <Listbox v-model="selectedPerson">     <ListboxButton>{{ selectedPerson.name }}</ListboxButton>      <!-- Use Vue's built-in `transition` component to add transitions. -->``

    `<transition`

      `enter-active-class="transition duration-100 ease-out"`

      `enter-from-class="transform scale-95 opacity-0"`

      `enter-to-class="transform scale-100 opacity-100"`

      `leave-active-class="transition duration-75 ease-out"`

      `leave-from-class="transform scale-100 opacity-100"`

      `leave-to-class="transform scale-95 opacity-0"`

    `>`

      `<ListboxOptions>         <ListboxOption           v-for="person in people"           :key="person.id"           :value="person"         >           {{ person.name }}         </ListboxOption>       </ListboxOptions>     </transition>   </Listbox> </template>  <script setup>   import { ref } from 'vue'   import {     Listbox,     ListboxButton,     ListboxOptions,     ListboxOption,   } from '@headlessui/vue'    const people = [     { id: 1, name: 'Durward Reynolds' },     { id: 2, name: 'Kenton Towne' },     { id: 3, name: 'Therese Wunsch' },     { id: 4, name: 'Benedict Kessler' },     { id: 5, name: 'Katelyn Rohan' },   ]   const selectedPerson = ref(people[0]) </script>`

If you'd like to coordinate multiple transitions for different children of your Listbox, check out the [Transition component included in Headless UI](https://headlessui.com/v1/vue/transition).

[](#rendering-as-different-elements)
------------------------------------

By default, the `Listbox` and its subcomponents each render a default element that is sensible for that component.

For example, `ListboxLabel` renders a `label` by default, `ListboxButton` renders a `button`, `ListboxOptions` renders a `ul`, and `ListboxOption` renders a `li`. By contrast, `Listbox` _does not render an element_, and instead renders its children directly.

This is easy to change using the `as` prop, which exists on every component.

``<template>   <!-- Render a `div` instead of nothing -->``

  `<Listbox as="div" v-model="selectedPerson">`

    ``<ListboxButton>{{ selectedPerson.name }}</ListboxButton>      <!-- Render a `div` instead of a `ul` -->        <ListboxOptions as="div">        <!-- Render a `span` instead of a `li` -->       <ListboxOption            as="span"          v-for="person in people"         :key="person.id"         :value="person"       >         {{ person.name }}       </ListboxOption>     </ListboxOptions>   </Listbox> </template>  <script setup>   import { ref } from 'vue'   import {     Listbox,     ListboxButton,     ListboxOptions,     ListboxOption,   } from '@headlessui/vue'    const people = [     { id: 1, name: 'Durward Reynolds' },     { id: 2, name: 'Kenton Towne' },     { id: 3, name: 'Therese Wunsch' },     { id: 4, name: 'Benedict Kessler' },     { id: 5, name: 'Katelyn Rohan' },   ]   const selectedPerson = ref(people[0]) </script>``

To tell an element to render its children directly with no wrapper element, use `as="template"`.

``<template>   <Listbox v-model="selectedPerson">     <!-- Render children directly instead of a `ListboxButton` -->``

    `<ListboxButton as="template">`

      `<button>{{ selectedPerson.name }}</button>     </ListboxButton>      <ListboxOptions>       <ListboxOption v-for="person in people" :key="person.id" :value="person">         {{ person.name }}       </ListboxOption>     </ListboxOptions>   </Listbox> </template>  <script setup>   import { ref } from 'vue'   import {     Listbox,     ListboxButton,     ListboxOptions,     ListboxOption,   } from '@headlessui/vue'    const people = [     { id: 1, name: 'Durward Reynolds' },     { id: 2, name: 'Kenton Towne' },     { id: 3, name: 'Therese Wunsch' },     { id: 4, name: 'Benedict Kessler' },     { id: 5, name: 'Katelyn Rohan' },   ]   const selectedPerson = ref(people[0]) </script>`

[](#horizontal-options)
-----------------------

If you've styled your `ListboxOptions` to appear horizontally, use the `horizontal` prop on the `Listbox` component to enable navigating the items with the left and right arrow keys instead of up and down, and to update the `aria-orientation` attribute for assistive technologies.

`<template>`

  `<Listbox v-model="selectedPerson" horizontal>`

    `<ListboxButton>{{ selectedPerson.name }}</ListboxButton>      <ListboxOptions class="flex flex-row">       <ListboxOption v-for="person in people" :key="person.id" :value="person">         {{ person.name }}       </ListboxOption>     </ListboxOptions>   </Listbox> </template>  <script setup>   import { ref } from 'vue'   import {     Listbox,     ListboxButton,     ListboxOptions,     ListboxOption,   } from '@headlessui/vue'    const people = [     { id: 1, name: 'Durward Reynolds' },     { id: 2, name: 'Kenton Towne' },     { id: 3, name: 'Therese Wunsch' },     { id: 4, name: 'Benedict Kessler' },     { id: 5, name: 'Katelyn Rohan' },   ]   const selectedPerson = ref(people[0]) </script>`

[](#accessibility-notes)
------------------------

### [](#focus-management)

When a Listbox is toggled open, the `ListboxOptions` receives focus. Focus is trapped within the list of items until Escape is pressed or the user clicks outside the options. Closing the Listbox returns focus to the `ListboxButton`.

### [](#mouse-interaction)

Clicking a `ListboxButton` toggles the options list open and closed. Clicking anywhere outside of the options list will close the listbox.

### [](#keyboard-interaction)

### [](#other)

All relevant ARIA attributes are automatically managed.

[](#component-api)
------------------

### [](#listbox)

The main Listbox component.

### [](#listbox-label)

A label that can be used for more control over the text your Listbox will announce to screenreaders. Its `id` attribute will be automatically generated and linked to the root `Listbox` component via the `aria-labelledby` attribute.

### [](#listbox-options)

The component that directly wraps the list of options in your custom Listbox.

### [](#listbox-option)

Used to wrap each item within your Listbox.</content>
</page>

<page>
  <title>Headless UI</title>
  <url>https://headlessui.com/v1/vue/combobox</url>
  <content>Comboboxes are the foundation of accessible autocompletes and command palettes for your app, complete with robust support for keyboard navigation.

[](#installation)
-----------------

To get started, install Headless UI via npm.

Please note that **this library only supports Vue 3**.

`npm install @headlessui/vue`

[](#basic-example)
------------------

Comboboxes are built using the `Combobox`, `ComboboxInput`, `ComboboxButton`, `ComboboxOptions`, `ComboboxOption` and `ComboboxLabel` components.

The `ComboboxInput` will automatically open/close the `ComboboxOptions` when searching.

You are completely in charge of how you filter the results, whether it be with a fuzzy search library client-side or by making server-side requests to an API. In this example we will keep the logic simple for demo purposes.

`<template>   <Combobox v-model="selectedPerson">     <ComboboxInput @change="query = $event.target.value" />     <ComboboxOptions>       <ComboboxOption         v-for="person in filteredPeople"         :key="person"         :value="person"       >         {{ person }}       </ComboboxOption>     </ComboboxOptions>   </Combobox> </template>  <script setup>   import { ref, computed } from 'vue'   import {     Combobox,     ComboboxInput,     ComboboxOptions,     ComboboxOption,   } from '@headlessui/vue'    const people = [     'Durward Reynolds',     'Kenton Towne',     'Therese Wunsch',     'Benedict Kessler',     'Katelyn Rohan',   ]   const selectedPerson = ref(people[0])   const query = ref('')    const filteredPeople = computed(() =>     query.value === ''       ? people       : people.filter((person) => {           return person.toLowerCase().includes(query.value.toLowerCase())         })   ) </script>`

In the previous example we used a list of `string` values as data, but you can also use objects with additional information. The only caveat is that you have to provide a `displayValue` to the input. This is important so that a string based version of your object can be rendered in the `ComboboxInput`.

`<template>   <Combobox v-model="selectedPerson">     <ComboboxInput       @change="query = $event.target.value"`

      `:displayValue="(person) => person.name"`

    `/>     <ComboboxOptions>       <ComboboxOption         v-for="person in filteredPeople"         :key="person.id"         :value="person"         :disabled="person.unavailable"       >         {{ person.name }}       </ComboboxOption>     </ComboboxOptions>   </Combobox> </template>  <script setup>   import { ref, computed } from 'vue'   import {     Combobox,     ComboboxInput,     ComboboxOptions,     ComboboxOption,   } from '@headlessui/vue'    const people = [     { id: 1, name: 'Durward Reynolds', unavailable: false },     { id: 2, name: 'Kenton Towne', unavailable: false },     { id: 3, name: 'Therese Wunsch', unavailable: false },     { id: 4, name: 'Benedict Kessler', unavailable: true },     { id: 5, name: 'Katelyn Rohan', unavailable: false },   ]   const selectedPerson = ref(people[0])   const query = ref('')    const filteredPeople = computed(() =>     query.value === ''       ? people       : people.filter((person) => {           return person.name.toLowerCase().includes(query.value.toLowerCase())         })   ) </script>`

[](#styling-different-states)
-----------------------------

Headless UI keeps track of a lot of state about each component, like which combobox option is currently selected, whether a popover is open or closed, or which item in a combobox is currently active via the keyboard.

But because the components are headless and completely unstyled out of the box, you can't _see_ this information in your UI until you provide the styles you want for each state yourself.

### [](#using-slots)

Each component exposes information about its current state via [slot props](https://vuejs.org/api/built-in-directives.html#v-slot) that you can use to conditionally apply different styles or render different content.

For example, the `ComboboxOption` component exposes an `active` state, which tells you if the item is currently focused via the mouse or keyboard.

``<template>   <Combobox v-model="selectedPerson">     <ComboboxInput       @change="query = $event.target.value"       :displayValue="(person) => person.name"     />     <ComboboxOptions>       <!-- Use the `active` state to conditionally style the active option. -->       <!-- Use the `selected` state to conditionally style the selected option. -->       <ComboboxOption         v-for="person in filteredPeople"         :key="person.id"         :value="person"         as="template"``

        `v-slot="{ active, selected }"`

      `>         <li           :class="{              'bg-blue-500 text-white': active,              'bg-white text-black': !active,            }"         >              <CheckIcon v-show="selected" />            {{ person.name }}         </li>       </ComboboxOption>     </ComboboxOptions>   </Combobox> </template>  <script setup>   import { ref, computed } from 'vue'   import {     Combobox,     ComboboxInput,     ComboboxOptions,     ComboboxOption,   } from '@headlessui/vue'   import { CheckIcon } from '@heroicons/vue/20/solid'    const people = [     { id: 1, name: 'Durward Reynolds' },     { id: 2, name: 'Kenton Towne' },     { id: 3, name: 'Therese Wunsch' },     { id: 4, name: 'Benedict Kessler' },     { id: 5, name: 'Katelyn Rohan' },   ]   const selectedPerson = ref(people[0])   const query = ref('')    const filteredPeople = computed(() =>     query.value === ''       ? people       : people.filter((person) => {           return person.name.toLowerCase().includes(query.value.toLowerCase())         })   ) </script>`

For a complete list of all the available slot props, see the [component API documentation](#component-api).

### [](#using-data-attributes)

Each component also exposes information about its current state via a `data-headlessui-state` attribute that you can use to conditionally apply different styles.

When any of the states in the [slot prop API](#component-api) are `true`, they will be listed in this attribute as space-separated strings so you can target them with a [CSS attribute selector](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors) in the form `[attr~=value]`.

For example, here's what the `ComboboxOptions` component with some child `ComboboxOption` components renders when the combobox is open and the second item is `active`:

``<!-- Rendered `ComboboxOptions` --> <ul data-headlessui-state="open">   <li data-headlessui-state="">Wade Cooper</li>   <li data-headlessui-state="active selected">Arlene Mccoy</li>   <li data-headlessui-state="">Devon Webb</li> </ul>``

If you are using [Tailwind CSS](https://tailwindcss.com/), you can use the [@headlessui/tailwindcss](https://github.com/tailwindlabs/headlessui/tree/main/packages/%40headlessui-tailwindcss) plugin to target this attribute with modifiers like `ui-open:*` and `ui-active:*`:

`<template>   <Combobox v-model="selectedPerson">     <ComboboxInput       @change="query = $event.target.value"       :displayValue="(person) => person.name"     />     <ComboboxOptions>       <ComboboxOption         v-for="person in filteredPeople"         :key="person.id"         :value="person"`

        `class="ui-active:bg-blue-500 ui-active:text-white ui-not-active:bg-white ui-not-active:text-black"`

      `>            <CheckIcon class="hidden ui-selected:block" />          {{ person.name }}       </ComboboxOption>     </ComboboxOptions>   </Combobox> </template>  <script setup>   import { ref, computed } from 'vue'   import {     Combobox,     ComboboxInput,     ComboboxOptions,     ComboboxOption,   } from '@headlessui/vue'   import { CheckIcon } from '@heroicons/vue/20/solid'    const people = [     { id: 1, name: 'Durward Reynolds' },     { id: 2, name: 'Kenton Towne' },     { id: 3, name: 'Therese Wunsch' },     { id: 4, name: 'Benedict Kessler' },     { id: 5, name: 'Katelyn Rohan' },   ]   const selectedPerson = ref(people[0])   const query = ref('')    const filteredPeople = computed(() =>     query.value === ''       ? people       : people.filter((person) => {           return person.name.toLowerCase().includes(query.value.toLowerCase())         })   ) </script>`

[](#binding-objects-as-values)
------------------------------

Unlike native HTML form controls which only allow you to provide strings as values, Headless UI supports binding complex objects as well.

`<template>`

  `<Combobox v-model="selectedPerson">`

    `<ComboboxInput       @change="query = $event.target.value"       :displayValue="(person) => person.name"     />     <ComboboxOptions>       <ComboboxOption         v-for="person in filteredPeople"         :key="person.id"            :value="person"          :disabled="person.unavailable"       >         {{ person.name }}       </ComboboxOption>     </ComboboxOptions>   </Combobox> </template>  <script setup>   import { ref, computed } from 'vue'   import {     Combobox,     ComboboxInput,     ComboboxOptions,     ComboboxOption,   } from '@headlessui/vue'      const people = [        { id: 1, name: 'Durward Reynolds', unavailable: false },        { id: 2, name: 'Kenton Towne', unavailable: false },        { id: 3, name: 'Therese Wunsch', unavailable: false },        { id: 4, name: 'Benedict Kessler', unavailable: true },        { id: 5, name: 'Katelyn Rohan', unavailable: false },      ]    const selectedPerson = ref(people[1])   const query = ref('')    const filteredPeople = computed(() =>     query.value === ''       ? people       : people.filter((person) => {           return person.name.toLowerCase().includes(query.value.toLowerCase())         })   ) </script>`

When binding objects as values, it's important to make sure that you use the _same instance_ of the object as both the `value` of the `Combobox` as well as the corresponding `ComboboxOption`, otherwise they will fail to be equal and cause the combobox to behave incorrectly.

To make it easier to work with different instances of the same object, you can use the `by` prop to compare the objects by a particular field instead of comparing object identity:

`<template>   <Combobox     :modelValue="modelValue"     @update:modelValue="value => emit('update:modelValue', value)"`

    `by="id"`

  `>     <ComboboxInput       @change="query = $event.target.value"       :displayValue="(department) => department.name"     />     <ComboboxOptions>       <ComboboxOption         v-for="department in filteredDepartments"         :key="department.id"         :value="department"       >         {{ department.name }}       </ComboboxOption>     </ComboboxOptions>   </Combobox> </template>  <script setup>   import { ref, computed } from 'vue'   import {     Combobox,     ComboboxInput,     ComboboxOptions,     ComboboxOption,   } from '@headlessui/vue'    const props = defineProps({ modelValue: Object })   const emit = defineEmits(['update:modelValue'])    const departments = [     { id: 1, name: 'Marketing', contact: 'Durward Reynolds' },     { id: 2, name: 'HR', contact: 'Kenton Towne' },     { id: 3, name: 'Sales', contact: 'Therese Wunsch' },     { id: 4, name: 'Finance', contact: 'Benedict Kessler' },     { id: 5, name: 'Customer service', contact: 'Katelyn Rohan' },   ]   const query = ref('')    const filteredDepartments = computed(() =>     query.value === ''       ? departments       : departments.filter((department) => {           return department.name             .toLowerCase()             .includes(query.value.toLowerCase())         })   ) </script>`

You can also pass your own comparison function to the `by` prop if you'd like complete control over how objects are compared:

`<template>   <Combobox     :modelValue="modelValue"     @update:modelValue="value => emit('update:modelValue', value)"`

    `:by="compareDepartments"`

  `>     <ComboboxInput       @change="query = $event.target.value"       :displayValue="(department) => department.name"     />     <ComboboxOptions>       <ComboboxOption         v-for="department in departments"         :key="department.id"         :value="department"       >         {{ department.name }}       </ComboboxOption>     </ComboboxOptions>   </Combobox> </template>  <script setup>   import { ref, computed } from 'vue'   import {     Combobox,     ComboboxInput,     ComboboxOptions,     ComboboxOption,   } from '@headlessui/vue'    const props = defineProps({ modelValue: Object })   const emit = defineEmits(['update:modelValue'])      function compareDepartments(a, b) {        return a.name.toLowerCase() === b.name.toLowerCase()      }    const departments = [     { id: 1, name: 'Marketing', contact: 'Durward Reynolds' },     { id: 2, name: 'HR', contact: 'Kenton Towne' },     { id: 3, name: 'Sales', contact: 'Therese Wunsch' },     { id: 4, name: 'Finance', contact: 'Benedict Kessler' },     { id: 5, name: 'Customer service', contact: 'Katelyn Rohan' },   ]   const query = ref('')    const filteredDepartments = computed(() =>     query.value === ''       ? departments       : departments.filter((department) => {           return department.name             .toLowerCase()             .includes(query.value.toLowerCase())         })   ) </script>`

[](#selecting-multiple-values)
------------------------------

The Combobox component allows you to select multiple values. You can enable this by providing an array of values instead of a single value.

`<template>`

  `<Combobox v-model="selectedPeople" multiple>`

    `<ul v-if="selectedPeople.length > 0">       <li v-for="person in selectedPeople" :key="person.id">         {{ person.name }}       </li>     </ul>     <ComboboxInput />     <ComboboxOptions>       <ComboboxOption v-for="person in people" :key="person.id" :value="person">         {{ person.name }}       </ComboboxOption>     </ComboboxOptions>   </Combobox> </template>  <script setup>   import { ref } from 'vue'   import {     Combobox,     ComboboxInput,     ComboboxOptions,     ComboboxOption,   } from '@headlessui/vue'    const people = [     { id: 1, name: 'Durward Reynolds' },     { id: 2, name: 'Kenton Towne' },     { id: 3, name: 'Therese Wunsch' },     { id: 4, name: 'Benedict Kessler' },     { id: 5, name: 'Katelyn Rohan' },   ]   const selectedPeople = ref([people[0], people[1]]) </script>`

This will keep the combobox open when you are selecting options, and choosing an option will toggle it in place.

Your `v-model` binding will be updated with an array containing all selected options any time an option is added or removed.

[](#using-a-custom-label)
-------------------------

By default the `Combobox` will use the input contents as the label for screenreaders. If you'd like more control over what is announced to assistive technologies, use the `ComboboxLabel` component.

`<template>   <Combobox v-model="selectedPerson">`

    `<ComboboxLabel>Assignee:</ComboboxLabel>`

    `<ComboboxInput       @change="query = $event.target.value"       :displayValue="(person) => person.name"     />     <ComboboxOptions>       <ComboboxOption         v-for="person in filteredPeople"         :key="person.id"         :value="person"       >         {{ person.name }}       </ComboboxOption>     </ComboboxOptions>   </Combobox> </template>  <script setup>   import { ref, computed } from 'vue'   import {     Combobox,     ComboboxLabel,     ComboboxInput,     ComboboxOptions,     ComboboxOption,   } from '@headlessui/vue'    const people = [     { id: 1, name: 'Durward Reynolds' },     { id: 2, name: 'Kenton Towne' },     { id: 3, name: 'Therese Wunsch' },     { id: 4, name: 'Benedict Kessler' },     { id: 5, name: 'Katelyn Rohan' },   ]   const selectedPerson = ref(people[0])   const query = ref('')    const filteredPeople = computed(() =>     query.value === ''       ? people       : people.filter((person) => {           return person.name.toLowerCase().includes(query.value.toLowerCase())         })   ) </script>`

[](#using-with-html-forms)
--------------------------

If you add the `name` prop to your combobox, hidden `input` elements will be rendered and kept in sync with your selected value.

`<template>   <form action="/projects/1/assignee" method="post">`

    `<Combobox v-model="selectedPerson" name="assignee">`

      `<ComboboxInput         @change="query = $event.target.value"         :displayValue="(person) => person.name"       />       <ComboboxOptions>         <ComboboxOption           v-for="person in filteredPeople"           :key="person.id"           :value="person"         >           {{ person.name }}         </ComboboxOption>       </ComboboxOptions>     </Combobox>     <button>Submit</button>   </form> </template>  <script setup>   import { ref, computed } from 'vue'   import {     Combobox,     ComboboxInput,     ComboboxOptions,     ComboboxOption,   } from '@headlessui/vue'    const people = [     { id: 1, name: 'Durward Reynolds' },     { id: 2, name: 'Kenton Towne' },     { id: 3, name: 'Therese Wunsch' },     { id: 4, name: 'Benedict Kessler' },     { id: 5, name: 'Katelyn Rohan' },   ]   const selectedPerson = ref(people[0])   const query = ref('')    const filteredPeople = computed(() =>     query.value === ''       ? people       : people.filter((person) => {           return person.name.toLowerCase().includes(query.value.toLowerCase())         })   ) </script>`

This lets you use a combobox inside a native HTML `<form>` and make traditional form submissions as if your combobox was a native HTML form control.

Basic values like strings will be rendered as a single hidden input containing that value, but complex values like objects will be encoded into multiple inputs using a square bracket notation for the names:

`<input type="hidden" name="assignee[id]" value="1" /> <input type="hidden" name="assignee[name]" value="Durward Reynolds" />`

[](#using-as-an-uncontrolled-component)
---------------------------------------

If you provide a `defaultValue` prop to the `Combobox` instead of a `value`, Headless UI will track its state internally for you, allowing you to use it as an [uncontrolled component](https://reactjs.org/docs/uncontrolled-components.html).

`<template>   <form action="/projects/1/assignee" method="post">`

    `<Combobox name="assignee" :defaultValue="people[0]">`

      `<ComboboxInput         @change="query = $event.target.value"         :displayValue="(person) => person.name"       />       <ComboboxOptions>         <ComboboxOption           v-for="person in filteredPeople"           :key="person.id"           :value="person"         >           {{ person.name }}         </ComboboxOption>       </ComboboxOptions>     </Combobox>     <button>Submit</button>   </form> </template>  <script setup>   import { ref, computed } from 'vue'   import {     Combobox,     ComboboxInput,     ComboboxOptions,     ComboboxOption,   } from '@headlessui/vue'    const people = [     { id: 1, name: 'Durward Reynolds' },     { id: 2, name: 'Kenton Towne' },     { id: 3, name: 'Therese Wunsch' },     { id: 4, name: 'Benedict Kessler' },     { id: 5, name: 'Katelyn Rohan' },   ]   const query = ref('')    const filteredPeople = computed(() =>     query.value === ''       ? people       : people.filter((person) => {           return person.name.toLowerCase().includes(query.value.toLowerCase())         })   ) </script>`

This can simplify your code when using the combobox [with HTML forms](#using-with-html-forms) or with form APIs that collect their state using [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData) instead of tracking it using React state.

Any `@update:modelValue` prop you provide will still be called when the component's value changes in case you need to run any side effects, but you won't need to use it to track the component's state yourself.

[](#allowing-custom-values)
---------------------------

You can allow users to enter their own value that doesn't exist in the list by including a dynamic `ComboboxOption` based on the `query` value.

`<template>   <Combobox v-model="selectedPerson">     <ComboboxInput       @change="query = $event.target.value"       :displayValue="(person) => person.name"     />     <ComboboxOptions>`

      `<ComboboxOption v-if="queryPerson" :value="queryPerson">`

        `Create "{{ query }}"`

      `</ComboboxOption>`

      `<ComboboxOption         v-for="person in filteredPeople"         :key="person.id"         :value="person"       >         {{ person.name }}       </ComboboxOption>     </ComboboxOptions>   </Combobox> </template>  <script setup>   import { ref, computed } from 'vue'   import {     Combobox,     ComboboxInput,     ComboboxOptions,     ComboboxOption,   } from '@headlessui/vue'    const people = [     { id: 1, name: 'Durward Reynolds' },     { id: 2, name: 'Kenton Towne' },     { id: 3, name: 'Therese Wunsch' },     { id: 4, name: 'Benedict Kessler' },     { id: 5, name: 'Katelyn Rohan' },   ]   const selectedPerson = ref(people[0])   const query = ref('')      const queryPerson = computed(() => {        return query.value === '' ? null : { id: null, name: query.value }      })    const filteredPeople = computed(() =>     query.value === ''       ? people       : people.filter((person) => {           return person.name.toLowerCase().includes(query.value.toLowerCase())         })   ) </script>`

[](#rendering-the-active-option-on-the-side)
--------------------------------------------

Depending on what you're building it can sometimes make sense to render additional information about the active option outside of the `<ComboboxOptions>`. For example, a preview of the active option within the context of a command palette. In these situations you can read the `activeOption` slot prop argument to access this information.

`<template>`

  `<Combobox v-model="selectedPerson" v-slot="{ activeOption }">`

    `<ComboboxInput       @change="query = $event.target.value"       :displayValue="(person) => person.name"     />     <ComboboxOptions>       <ComboboxOption         v-for="person in filteredPeople"         :key="person.id"         :value="person"       >         {{ person.name }}       </ComboboxOption>     </ComboboxOptions>        <div v-if="activeOption">        The current active user is: {{ activeOption.name }}        </div>    </Combobox> </template>  <script setup>   import { ref, computed } from 'vue'   import {     Combobox,     ComboboxInput,     ComboboxOptions,     ComboboxOption,   } from '@headlessui/vue'    const people = [     { id: 1, name: 'Durward Reynolds' },     { id: 2, name: 'Kenton Towne' },     { id: 3, name: 'Therese Wunsch' },     { id: 4, name: 'Benedict Kessler' },     { id: 5, name: 'Katelyn Rohan' },   ]   const selectedPerson = ref(people[0])   const query = ref('')    const filteredPeople = computed(() =>     query.value === ''       ? people       : people.filter((person) => {           return person.name.toLowerCase().includes(query.value.toLowerCase())         })   ) </script>`

The `activeOption` will be the `value` of the current active `ComboboxOption`.

[](#showing-hiding-the-combobox)
--------------------------------

By default, your `ComboboxOptions` instance will be shown/hidden automatically based on the internal `open` state tracked within the `Combobox` component itself.

``<template>   <Combobox v-model="selectedPerson">     <ComboboxInput       @change="query = $event.target.value"       :displayValue="(person) => person.name"     />      <!--       By default, the `ComboboxOptions` will automatically show/hide when       typing in the `ComboboxInput`, or when pressing the `ComboboxButton`.     -->     <ComboboxOptions>       <ComboboxOption         v-for="person in filteredPeople"         :key="person.id"         :value="person"       >         {{ person.name }}       </ComboboxOption>     </ComboboxOptions>   </Combobox> </template>  <script setup>   import { ref, computed } from 'vue'   import {     Combobox,     ComboboxInput,     ComboboxOptions,     ComboboxOption,   } from '@headlessui/vue'    const people = [     { id: 1, name: 'Durward Reynolds' },     { id: 2, name: 'Kenton Towne' },     { id: 3, name: 'Therese Wunsch' },     { id: 4, name: 'Benedict Kessler' },     { id: 5, name: 'Katelyn Rohan' },   ]   const selectedPerson = ref(people[0])   const query = ref('')    const filteredPeople = computed(() =>     query.value === ''       ? people       : people.filter((person) => {           return person.name.toLowerCase().includes(query.value.toLowerCase())         })   ) </script>``

If you'd rather handle this yourself (perhaps because you need to add an extra wrapper element for one reason or another), you can add a `static` prop to the `ComboboxOptions` instance to tell it to always render, and inspect the `open` slot prop provided by the `Combobox` to control which element is shown/hidden yourself.

`<template>`

  `<Combobox v-model="selectedPerson" v-slot="{ open }">`

    ``<ComboboxInput       @change="query = $event.target.value"       :displayValue="(person) => person.name"     />        <div v-show="open">        <!--         Using the `static` prop, the `ComboboxOptions` are always         rendered and the `open` state is ignored.       -->          <ComboboxOptions static>          <ComboboxOption           v-for="person in filteredPeople"           :key="person.id"           :value="person"         >           {{ person.name }}         </ComboboxOption>       </ComboboxOptions>     </div>   </Combobox> </template>  <script setup>   import { ref, computed } from 'vue'   import {     Combobox,     ComboboxInput,     ComboboxOptions,     ComboboxOption,   } from '@headlessui/vue'    const people = [     { id: 1, name: 'Durward Reynolds' },     { id: 2, name: 'Kenton Towne' },     { id: 3, name: 'Therese Wunsch' },     { id: 4, name: 'Benedict Kessler' },     { id: 5, name: 'Katelyn Rohan' },   ]   const selectedPerson = ref(people[0])   const query = ref('')    const filteredPeople = computed(() =>     query.value === ''       ? people       : people.filter((person) => {           return person.name.toLowerCase().includes(query.value.toLowerCase())         })   ) </script>``

[](#disabling-an-option)
------------------------

Use the `disabled` prop to disable a `ComboboxOption`. This will make it unselectable via mouse and keyboard, and it will be skipped when pressing the up/down arrows.

`<template>   <Combobox v-model="selectedPerson">     <ComboboxInput       @change="query = $event.target.value"       :displayValue="(person) => person.name"     />      <ComboboxOptions>       <!-- Disabled options will be skipped by keyboard navigation. -->       <ComboboxOption         v-for="person in filteredPeople"         :key="person.id"         :value="person"`

        `:disabled="person.unavailable"`

      `>         <span :class='{ "opacity-75": person.unavailable }'>           {{ person.name }}         </span>       </ComboboxOption>     </ComboboxOptions>   </Combobox> </template>  <script setup>   import { ref, computed } from 'vue'   import {     Combobox,     ComboboxInput,     ComboboxOptions,     ComboboxOption,   } from '@headlessui/vue'    const people = [     { id: 1, name: 'Durward Reynolds', unavailable: true },     { id: 2, name: 'Kenton Towne', unavailable: false },     { id: 3, name: 'Therese Wunsch', unavailable: false },     { id: 4, name: 'Benedict Kessler', unavailable: true },     { id: 5, name: 'Katelyn Rohan', unavailable: false },   ]   const selectedPerson = ref(people[0])   const query = ref('')    const filteredPeople = computed(() =>     query.value === ''       ? people       : people.filter((person) => {           return person.name.toLowerCase().includes(query.value.toLowerCase())         })   ) </script>`

[](#allowing-empty-values)
--------------------------

By default, once you've selected a value in a combobox there is no way to clear the combobox back to an empty value — when you clear the input and tab away, the value returns to the previously selected value.

If you want to support empty values in your combobox, use the `nullable` prop.

`<template>`

  `<Combobox v-model="selectedPerson" nullable>`

    `<ComboboxInput       @change="query = $event.target.value"          :displayValue="(person) => person?.name"      />      <ComboboxOptions>       <ComboboxOption         v-for="person in filteredPeople"         :key="person.id"         :value="person"       >         {{ person.name }}       </ComboboxOption>     </ComboboxOptions>   </Combobox> </template>  <script setup>   import { ref, computed } from 'vue'   import {     Combobox,     ComboboxInput,     ComboboxOptions,     ComboboxOption,   } from '@headlessui/vue'    const people = [     { id: 1, name: 'Durward Reynolds', unavailable: true },     { id: 2, name: 'Kenton Towne', unavailable: false },     { id: 3, name: 'Therese Wunsch', unavailable: false },     { id: 4, name: 'Benedict Kessler', unavailable: true },     { id: 5, name: 'Katelyn Rohan', unavailable: false },   ]   const selectedPerson = ref(people[0])   const query = ref('')    const filteredPeople = computed(() =>     query.value === ''       ? people       : people.filter((person) => {           return person.name.toLowerCase().includes(query.value.toLowerCase())         })   ) </script>`

When the `nullable` prop is used, clearing the input and navigating away from the element will update your `v-model` binding and invoke your `displayValue` callback with `null`.

This prop doesn't do anything when allowing [multiple values](#selecting-multiple-values) because options are toggled on and off, resulting in an empty array (rather than null) if nothing is selected.

[](#transitions)
----------------

To animate the opening/closing of your combobox, you can use Vue's built-in `<transition>` component. All you need to do is wrap your `ComboboxOptions` instance in a `<transition>`, and the transition will be applied automatically.

``<template>   <Combobox v-model="selectedPerson">     <ComboboxInput       @change="query = $event.target.value"       :displayValue="(person) => person.name"     />      <!-- Use Vue's built-in `transition` component to add transitions. -->``

    `<transition`

      `enter-active-class="transition duration-100 ease-out"`

      `enter-from-class="transform scale-95 opacity-0"`

      `enter-to-class="transform scale-100 opacity-100"`

      `leave-active-class="transition duration-75 ease-out"`

      `leave-from-class="transform scale-100 opacity-100"`

      `leave-to-class="transform scale-95 opacity-0"`

    `>`

      `<ComboboxOptions>         <ComboboxOption           v-for="person in filteredPeople"           :key="person.id"           :value="person"         >           {{ person.name }}         </ComboboxOption>       </ComboboxOptions>        </transition>    </Combobox> </template>  <script setup>   import { ref, computed } from 'vue'   import {     Combobox,     ComboboxInput,     ComboboxOptions,     ComboboxOption,   } from '@headlessui/vue'    const people = [     { id: 1, name: 'Durward Reynolds' },     { id: 2, name: 'Kenton Towne' },     { id: 3, name: 'Therese Wunsch' },     { id: 4, name: 'Benedict Kessler' },     { id: 5, name: 'Katelyn Rohan' },   ]   const selectedPerson = ref(people[0])   const query = ref('')    const filteredPeople = computed(() =>     query.value === ''       ? people       : people.filter((person) => {           return person.name.toLowerCase().includes(query.value.toLowerCase())         })   ) </script>`

If you'd like to coordinate multiple transitions for different children of your Combobox, check out the [Transition component included in Headless UI](https://headlessui.com/v1/vue/transition).

[](#rendering-as-different-elements)
------------------------------------

By default, the `Combobox` and its subcomponents each render a default element that is sensible for that component.

For example, `ComboboxLabel` renders a `label` by default, `ComboboxInput` renders an `input`, `ComboboxButton` renders a `button`, `ComboboxOptions` renders a `ul`, and `ComboboxOption` renders a `li`. By contrast, `Combobox` _does not render an element_, and instead renders its children directly.

This is easy to change using the `as` prop, which exists on every component.

``<template>   <!-- Render a `div` instead of nothing -->``

  `<Combobox as="div" v-model="selectedPerson">`

    ``<ComboboxInput       @change="query = $event.target.value"       :displayValue="(person) => person.name"     />      <!-- Render a `div` instead of a `ul` -->        <ComboboxOptions as="div">        <!-- Render a `span` instead of a `li` -->       <ComboboxOption            as="span"          v-for="person in filteredPeople"         :key="person.id"         :value="person"       >         {{ person.name }}       </ComboboxOption>     </ComboboxOptions>   </Combobox> </template>  <script setup>   import { ref, computed } from 'vue'   import {     Combobox,     ComboboxInput,     ComboboxOptions,     ComboboxOption,   } from '@headlessui/vue'    const people = [     { id: 1, name: 'Durward Reynolds' },     { id: 2, name: 'Kenton Towne' },     { id: 3, name: 'Therese Wunsch' },     { id: 4, name: 'Benedict Kessler' },     { id: 5, name: 'Katelyn Rohan' },   ]   const selectedPerson = ref(people[0])   const query = ref('')    const filteredPeople = computed(() =>     query.value === ''       ? people       : people.filter((person) => {           return person.name.toLowerCase().includes(query.value.toLowerCase())         })   ) </script>``

To tell an element to render its children directly with no wrapper element, use `as="template"`.

``<template>   <Combobox v-model="selectedPerson">     <!-- Render children directly instead of an `input` -->     <ComboboxInput``

      `as="template"`

      `@change="query = $event.target.value"       :displayValue="(person) => person.name"     >       <input />     </ComboboxInput>      <ComboboxOptions>       <ComboboxOption         v-for="person in filteredPeople"         :key="person.id"         :value="person"       >         {{ person.name }}       </ComboboxOption>     </ComboboxOptions>   </Combobox> </template>  <script setup>   import { ref, computed } from 'vue'   import {     Combobox,     ComboboxInput,     ComboboxOptions,     ComboboxOption,   } from '@headlessui/vue'    const people = [     { id: 1, name: 'Durward Reynolds' },     { id: 2, name: 'Kenton Towne' },     { id: 3, name: 'Therese Wunsch' },     { id: 4, name: 'Benedict Kessler' },     { id: 5, name: 'Katelyn Rohan' },   ]   const selectedPerson = ref(people[0])   const query = ref('')    const filteredPeople = computed(() =>     query.value === ''       ? people       : people.filter((person) => {           return person.name.toLowerCase().includes(query.value.toLowerCase())         })   ) </script>`

[](#accessibility-notes)
------------------------

### [](#focus-management)

When a Combobox is toggled open, the `ComboboxInput` stays focused.

The `ComboboxButton` is ignored for the default tab flow, this means that pressing `Tab` in the `ComboboxInput` will skip passed the `ComboboxButton`.

### [](#mouse-interaction)

Clicking a `ComboboxButton` toggles the options list open and closed. Clicking anywhere outside of the options list will close the combobox.

### [](#keyboard-interaction)

### [](#other)

All relevant ARIA attributes are automatically managed.

[](#component-api)
------------------

### [](#combobox)

The main Combobox component.

### [](#combobox-label)

A label that can be used for more control over the text your Combobox will announce to screenreaders. Its `id` attribute will be automatically generated and linked to the root `Combobox` component via the `aria-labelledby` attribute.

### [](#combobox-options)

The component that directly wraps the list of options in your custom Combobox.

### [](#combobox-option)

Used to wrap each item within your Combobox.</content>
</page>

<page>
  <title>Headless UI</title>
  <url>https://headlessui.com/v1/vue/switch</url>
  <content>Switches are a pleasant interface for toggling a value between two states, and offer the same semantics and keyboard navigation as native checkbox elements.

[](#installation)
-----------------

To get started, install Headless UI via npm.

Please note that **this library only supports Vue 3**.

`npm install @headlessui/vue`

[](#basic-example)
------------------

Switches are built using the `Switch` component, which takes in a ref via the `v-model` prop. You can toggle your Switch by clicking directly on the component, or by pressing the spacebar while its focused.

Toggling the switch updates your ref to its negated value.

`<template>   <Switch     v-model="enabled"     :class="enabled ? 'bg-blue-600' : 'bg-gray-200'"     class="relative inline-flex h-6 w-11 items-center rounded-full"   >     <span class="sr-only">Enable notifications</span>     <span       :class="enabled ? 'translate-x-6' : 'translate-x-1'"       class="inline-block h-4 w-4 transform rounded-full bg-white transition"     />   </Switch> </template>  <script setup>   import { ref } from 'vue'   import { Switch } from '@headlessui/vue'    const enabled = ref(false) </script>`

[](#styling-different-states)
-----------------------------

Headless UI keeps track of a lot of state about each component, like which switch option is currently selected, whether a popover is open or closed, or which item in a menu is currently active via the keyboard.

But because the components are headless and completely unstyled out of the box, you can't _see_ this information in your UI until you provide the styles you want for each state yourself.

### [](#using-slots)

Each component exposes information about its current state via [slot props](https://vuejs.org/api/built-in-directives.html#v-slot) that you can use to conditionally apply different styles or render different content.

For example, the `Switch` component exposes an `checked` state, which tells you if the switch is currently checked or not.

`<template>`

  ``<!-- Use the `checked` state to conditionally style the button. -->``

  `<Switch v-model="enabled" as="template" v-slot="{ checked }">     <button       class="relative inline-flex h-6 w-11 items-center rounded-full"          :class="checked ? 'bg-blue-600' : 'bg-gray-200'"      >       <span class="sr-only">Enable notifications</span>       <span            :class="checked ? 'translate-x-6' : 'translate-x-1'"          class="inline-block h-4 w-4 transform rounded-full bg-white transition"       />     </button>   </Switch> </template>  <script setup>   import { ref } from 'vue'   import { Switch } from '@headlessui/vue'    const enabled = ref(false) </script>`

For a complete list of all the available slot props, see the [component API documentation](#component-api).

### [](#using-data-attributes)

Each component also exposes information about its current state via a `data-headlessui-state` attribute that you can use to conditionally apply different styles.

When any of the states in the [slot prop API](#component-api) are `true`, they will be listed in this attribute as space-separated strings so you can target them with a [CSS attribute selector](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors) in the form `[attr~=value]`.

For example, here's what the `Switch` component renders when the switch is checked:

``<!-- Rendered `Switch` --> <button data-headlessui-state="checked"></button>``

If you are using [Tailwind CSS](https://tailwindcss.com/), you can use the [@headlessui/tailwindcss](https://github.com/tailwindlabs/headlessui/tree/main/packages/%40headlessui-tailwindcss) plugin to target this attribute with modifiers like `ui-checked:*`:

`<template>   <Switch     v-model="enabled"`

    `class="relative inline-flex h-6 w-11 items-center rounded-full ui-checked:bg-blue-600 ui-not-checked:bg-gray-200"`

  `>     <span class="sr-only">Enable notifications</span>     <span          class="inline-block h-4 w-4 transform rounded-full bg-white transition ui-checked:translate-x-6 ui-not-checked:translate-x-1"      />   </Switch> </template>  <script setup>   import { ref } from 'vue'   import { Switch } from '@headlessui/vue'    const enabled = ref(false) </script>`

[](#using-a-custom-label)
-------------------------

By default, a Switch renders a `button` as well as whatever children you pass into it. This can make it harder to implement certain UIs, since the children will be nested within the button.

In these situations, you can use the `SwitchLabel` component for more flexibility.

This example demonstrates how to use the `SwitchGroup`, `Switch` and `SwitchLabel` components to render a label as a sibling to the button. Note that `SwitchLabel` works alongside a `Switch` component, and they both must be rendered within a parent `SwitchGroup` component.

`<template>`

  `<SwitchGroup>`

    `<div class="flex items-center">          <SwitchLabel class="mr-4">Enable notifications</SwitchLabel>        <Switch         v-model="enabled"         :class='enabled ? "bg-blue-600" : "bg-gray-200"'         class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"       >         <span           :class='enabled ? "translate-x-6" : "translate-x-1"'           class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"         />       </Switch>     </div>      </SwitchGroup>  </template>  <script setup>   import { ref } from 'vue'   import { Switch, SwitchGroup, SwitchLabel } from '@headlessui/vue'    const enabled = ref(false) </script>`

By default, clicking a `SwitchLabel` will toggle the Switch, just like labels in native HTML checkboxes do. If you'd like to make the label non-clickable (which you might if it doesn't make sense for your design), you can add a `passive` prop to the `SwitchLabel` component:

`<template>   <SwitchGroup>`

    `<SwitchLabel passive>Enable notifications</SwitchLabel>`

    `<Switch v-model="enabled">       <!-- ... -->     </Switch>   </SwitchGroup> </template>  <script setup>   import { ref } from 'vue'   import { Switch, SwitchGroup, SwitchLabel } from '@headlessui/vue'    const enabled = ref(false) </script>`

[](#using-with-html-forms)
--------------------------

If you add the `name` prop to your switch, a hidden `input` element will be rendered and kept in sync with the switch state.

`<template>   <form action="/notification-settings" method="post">`

    `<Switch v-model="enabled" name="notifications">`

      `<!-- ... -->     </Switch>   </form> </template>  <script setup>   import { ref } from 'vue'   import { Switch } from '@headlessui/vue'    const enabled = ref(true) </script>`

This lets you use a switch inside a native HTML `<form>` and make traditional form submissions as if your switch was a native HTML form control.

By default, the value will be `'on'` when the switch is checked, and not present when the switch is unchecked.

`<input type="hidden" name="notifications" value="on" />`

You can customize the value if needed by using the `value` prop:

`<template>   <form action="/accounts" method="post">`

    `<Switch v-model="enabled" name="terms" value="accept">`

      `<!-- ... -->     </Switch>   </form> </template>  <script setup>   import { ref } from 'vue'   import { Switch } from '@headlessui/vue'    const enabled = ref(true) </script>`

The hidden input will then use your custom value when the switch is checked:

`<input type="hidden" name="terms" value="accept" />`

[](#using-as-an-uncontrolled-component)
---------------------------------------

If you provide a `defaultChecked` prop to the `Switch` instead of a `checked` prop, Headless UI will track its state internally for you, allowing you to use it as an [uncontrolled component](https://reactjs.org/docs/uncontrolled-components.html).

You can access the current state via the `checked` slot prop on the `Switch` component.

`<template>   <form action="/accounts" method="post">     <Switch       name="terms-of-service"`

      `:defaultChecked="true"`

      `as="template"       v-slot="{ checked }"     >       <button         :class="checked ? 'bg-blue-600' : 'bg-gray-200'"         class="relative inline-flex h-6 w-11 items-center rounded-full"       >         <span class="sr-only">Enable notifications</span>         <span           :class="checked ? 'translate-x-6' : 'translate-x-1'"           class="inline-block h-4 w-4 transform rounded-full bg-white transition"         />       </button>     </Switch>     <button>Submit</button>   </form> </template>  <script setup>   import { Switch } from '@headlessui/vue' </script>`

This can simplify your code when using the listbox [with HTML forms](#using-with-html-forms) or with form APIs that collect their state using [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData) instead of tracking it using React state.

Any `@update:modelValue` prop you provide will still be called when the component's value changes in case you need to run any side effects, but you won't need to use it to track the component's state yourself.

[](#transitions)
----------------

Because Switches are typically always rendered to the DOM (rather than being mounted/unmounted like other components), simple CSS transitions are often enough to animate your Switch:

`<template>   <Switch v-model="enabled">     <!-- Transition the switch's knob on state change -->     <span`

      `:class="enabled ? 'translate-x-9' : 'translate-x-0'"`

      `class="transform transition duration-200 ease-in-out"     />     <!-- ... -->   </Switch> </template>  <script setup>   import { ref } from 'vue'   import { Switch } from '@headlessui/vue'    const enabled = ref(false) </script>`

[](#accessibility-notes)
------------------------

### [](#labels)

By default, the children of a `Switch` will be used as the label for screen readers. If you're using `SwitchLabel`, the content of your `Switch` component will be ignored by assistive technologies.

### [](#mouse-interaction)

Clicking a `Switch` or a `SwitchLabel` toggles the Switch on and off.

### [](#keyboard-interaction)

### [](#other)

All relevant ARIA attributes are automatically managed.

[](#component-api)
------------------

### [](#switch)

The main Switch component.</content>
</page>

<page>
  <title>Headless UI</title>
  <url>https://headlessui.com/v1/vue/disclosure</url>
  <content>A simple, accessible foundation for building custom UIs that show and hide content, like togglable accordion panels.

[](#installation)
-----------------

To get started, install Headless UI via npm.

Please note that **this library only supports Vue 3**.

`npm install @headlessui/vue`

[](#basic-example)
------------------

Disclosures are built using the `Disclosure`, `DisclosureButton` and `DisclosurePanel` components.

The button will automatically open/close the panel when clicked, and all components will receive the appropriate aria-\* related attributes like `aria-expanded` and `aria-controls`.

`<template>   <Disclosure>     <DisclosureButton class="py-2">       Is team pricing available?     </DisclosureButton>     <DisclosurePanel class="text-gray-500">       Yes! You can purchase a license that you can share with your entire team.     </DisclosurePanel>   </Disclosure> </template>  <script setup>   import {     Disclosure,     DisclosureButton,     DisclosurePanel,   } from '@headlessui/vue' </script>`

[](#styling-different-states)
-----------------------------

Headless UI keeps track of a lot of state about each component, like which listbox option is currently selected, whether a popover is open or closed, or which item in a disclosure is currently active via the keyboard.

But because the components are headless and completely unstyled out of the box, you can't _see_ this information in your UI until you provide the styles you want for each state yourself.

### [](#using-slots)

Each component exposes information about its current state via [slot props](https://vuejs.org/api/built-in-directives.html#v-slot) that you can use to conditionally apply different styles or render different content.

For example, the `Disclosure` component exposes an `open` state, which tells you if the disclosure is currently open.

`<template>`

  `<Disclosure v-slot="{ open }">`

    ``<!-- Use the `open` state to conditionally change the direction of an icon. -->     <DisclosureButton class="py-2">       <span>Do you offer technical support?</span>          <ChevronRightIcon :class="open && 'rotate-90 transform'" />      </DisclosureButton>     <DisclosurePanel>No</DisclosurePanel>   </Disclosure> </template>  <script setup>   import {     Disclosure,     DisclosureButton,     DisclosurePanel,   } from '@headlessui/vue'   import { ChevronRightIcon } from '@heroicons/vue/20/solid' </script>``

For a complete list of all the available slot props, see the [component API documentation](#component-api).

### [](#using-data-attributes)

Each component also exposes information about its current state via a `data-headlessui-state` attribute that you can use to conditionally apply different styles.

When any of the states in the [slot prop API](#component-api) are `true`, they will be listed in this attribute as space-separated strings so you can target them with a [CSS attribute selector](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors) in the form `[attr~=value]`.

For example, here's what the `Disclosure` component renders when the disclosure is open:

``<!-- Rendered `Disclosure` --> <div data-headlessui-state="open">   <button data-headlessui-state="open">Do you offer technical support?</button>   <div data-headlessui-state="open">No</div> </div>``

If you are using [Tailwind CSS](https://tailwindcss.com/), you can use the [@headlessui/tailwindcss](https://github.com/tailwindlabs/headlessui/tree/main/packages/%40headlessui-tailwindcss) plugin to target this attribute with modifiers like `ui-open:*`:

`<template>   <Disclosure>     <DisclosureButton class="py-2">       <span>Do you offer technical support?</span>`

      `<ChevronRightIcon class="ui-open:rotate-90 ui-open:transform" />`

    `</DisclosureButton>     <DisclosurePanel>No</DisclosurePanel>   </Disclosure> </template>  <script setup>   import {     Disclosure,     DisclosureButton,     DisclosurePanel,   } from '@headlessui/vue'   import { ChevronRightIcon } from '@heroicons/vue/20/solid' </script>`

[](#showing-hiding-the-panel)
-----------------------------

By default, your `DisclosurePanel` will be shown/hidden automatically based on the internal open state tracked within the `Disclosure` component itself.

``<template>   <Disclosure>     <DisclosureButton>Is team pricing available?</DisclosureButton>      <!--       By default, the `DisclosurePanel` will automatically show/hide       when the `DisclosureButton` is pressed.     -->     <DisclosurePanel>       Yes! You can purchase a license that you can share with your entire team.     </DisclosurePanel>   </Disclosure> </template>  <script setup>   import {     Disclosure,     DisclosureButton,     DisclosurePanel,   } from '@headlessui/vue' </script>``

If you'd rather handle this yourself (perhaps because you need to add an extra wrapper element for one reason or another), you can pass a `static` prop to the `DisclosurePanel` to tell it to always render, and then use the `open` slot prop to control when the panel is shown/hidden yourself.

`<template>`

  `<Disclosure v-slot="{ open }">`

    ``<DisclosureButton>Is team pricing available?</DisclosureButton>        <div v-show="open">        <!--         Using the `static` prop, the `DisclosurePanel` is always         rendered and the `open` state is ignored.       -->          <DisclosurePanel static>          Yes! You can purchase a license that you can share with your entire         team.       </DisclosurePanel>     </div>   </Disclosure> </template>  <script setup>   import {     Disclosure,     DisclosureButton,     DisclosurePanel,   } from '@headlessui/vue' </script>``

[](#closing-disclosures-manually)
---------------------------------

To close a disclosure manually when clicking a child of its panel, render that child as a `DisclosureButton`. You can use the `:as` prop to customize which element is being rendered.

`<template>   <Disclosure>     <DisclosureButton>Open mobile menu</DisclosureButton>     <DisclosurePanel>`

      `<DisclosureButton :as="MyLink" href="/home">Home</DisclosureButton>`

      `<!-- ... -->     </DisclosurePanel>   </Disclosure> </template>  <script setup>   import {     Disclosure,     DisclosureButton,     DisclosurePanel,   } from '@headlessui/vue'   import MyLink from './MyLink' </script>`

This is especially useful when using disclosures for things like mobile menus that contain links where you want the disclosure to close when navigating to the next page.

Alternatively, `Disclosure` and `DisclosurePanel` expose a `close()` slot prop which you can use to imperatively close the panel, say after running an async action:

`<template>   <Disclosure>     <DisclosureButton>Terms</DisclosureButton>`

    `<DisclosurePanel v-slot="{ close }">`

      `<button @click="accept(close)">Read and accept</button>`

    `</DisclosurePanel>`

  `</Disclosure> </template>  <script setup>   import {     Disclosure,     DisclosureButton,     DisclosurePanel,   } from '@headlessui/vue'      async function accept(close) {        await fetch('/accept-terms', { method: 'POST' })        close()      }</script>`

By default the `DisclosureButton` receives focus after calling `close()`, but you can change this by passing a ref into `close(ref)`.

[](#transitions)
----------------

To animate the opening/closing of your Disclosure's panel, you can use Vue's built-in `<transition>` component. All you need to do is wrap your `DisclosurePanel`in a `<transition>`, and the transition will be applied automatically.

``<template>   <Disclosure>     <DisclosureButton>Is team pricing available?</DisclosureButton>      <!-- Use the built-in `transition` component to add transitions. -->``

    `<transition`

      `enter-active-class="transition duration-100 ease-out"`

      `enter-from-class="transform scale-95 opacity-0"`

      `enter-to-class="transform scale-100 opacity-100"`

      `leave-active-class="transition duration-75 ease-out"`

      `leave-from-class="transform scale-100 opacity-100"`

      `leave-to-class="transform scale-95 opacity-0"`

    `>`

      `<DisclosurePanel>         Yes! You can purchase a license that you can share with your entire         team.       </DisclosurePanel>     </transition>   </Disclosure> </template>  <script setup>   import {     Disclosure,     DisclosureButton,     DisclosurePanel,   } from '@headlessui/vue' </script>`

If you'd like to coordinate multiple transitions for different children of your Disclosure, check out the [Transition component included in Headless UI](https://headlessui.com/v1/vue/transition).

[](#rendering-as-different-elements)
------------------------------------

`Disclosure` and its subcomponents each render a default element that is sensible for that component: the `Button` renders a `<button>`, `Panel` renders a `<div>`. By contrast, the root `Disclosure` component _does not render an element_, and instead renders its children directly by default.

This is easy to change using the `as` prop, which exists on every component.

``<template>   <!-- Render a `div` for the root `Disclosure` component -->``

  `<Disclosure as="div">`

    ``<!-- Don't render any element (only children) for the `DisclosureButton` component -->        <DisclosureButton as="template">        <button>What languages do you support?</button>     </DisclosureButton>      <!-- Render a `ul` for the `DisclosurePanel` component -->        <DisclosurePanel as="ul">        <li>HTML</li>       <li>CSS</li>       <li>JavaScript</li>     </DisclosurePanel>   </Disclosure> </template>  <script setup>   import {     Disclosure,     DisclosureButton,     DisclosurePanel,   } from '@headlessui/vue' </script>``

[](#accessibility-notes)
------------------------

### [](#mouse-interaction)

Clicking a `DisclosureButton` toggles the Disclosure's panel open and closed.

### [](#keyboard-interaction)

### [](#other)

All relevant ARIA attributes are automatically managed.

[](#component-api)
------------------

### [](#disclosure)

The main Disclosure component.

### [](#disclosure-button)

The trigger component that toggles a Disclosure.

### [](#disclosure-panel)

This component contains the contents of your Disclosure.</content>
</page>

<page>
  <title>Headless UI</title>
  <url>https://headlessui.com/v1/vue/dialog</url>
  <content>A fully-managed, renderless dialog component jam-packed with accessibility and keyboard features, perfect for building completely custom modal and dialog windows for your next application.

[](#installation)
-----------------

To get started, install Headless UI via npm.

Please note that **this library only supports Vue 3**.

`npm install @headlessui/vue`

[](#basic-example)
------------------

Dialogs are built using the `Dialog`, `DialogPanel`, `DialogTitle` and `DialogDescription` components.

When the dialog's `open` prop is `true`, the contents of the dialog will render. Focus will be moved inside the dialog and trapped there as the user cycles through the focusable elements. Scroll is locked, the rest of your application UI is hidden from screen readers, and clicking outside the `DialogPanel` or pressing the Escape key will fire the `close` event and close the dialog.

`<template>   <Dialog :open="isOpen" @close="setIsOpen">     <DialogPanel>       <DialogTitle>Deactivate account</DialogTitle>       <DialogDescription>         This will permanently deactivate your account       </DialogDescription>        <p>         Are you sure you want to deactivate your account? All of your data will be         permanently removed. This action cannot be undone.       </p>        <button @click="setIsOpen(false)">Deactivate</button>       <button @click="setIsOpen(false)">Cancel</button>     </DialogPanel>   </Dialog> </template>  <script setup>   import { ref } from 'vue'   import {     Dialog,     DialogPanel,     DialogTitle,     DialogDescription,   } from '@headlessui/vue'    const isOpen = ref(true)    function setIsOpen(value) {     isOpen.value = value   } </script>`

If your dialog has a title and description, use the `DialogTitle` and `DialogDescription` components to provide the most accessible experience. This will link your title and description to the root dialog component via the `aria-labelledby` and `aria-describedby` attributes, ensuring their contents are announced to users using screenreaders when your dialog opens.

[](#showing-and-hiding-your-dialog)
-----------------------------------

Dialogs have no automatic management of their open/closed state. To show and hide your dialog, pass a ref into the `open` prop. When `open` is true the dialog will render, and when it's false the dialog will unmount.

The `close` event fires when an open dialog is dismissed, which happens when the user clicks outside your `DialogPanel` or presses the Escape key. You can use this event to set `open` back to false and close your dialog.

``<template>   <!--     Pass the `isOpen` ref to the `open` prop, and use the `close` event     to set the ref back to `false` when the user clicks outside of     the dialog or presses the escape key.   -->``

  `<Dialog :open="isOpen" @close="setIsOpen">`

    ``<DialogPanel>       <DialogTitle>Deactivate account</DialogTitle>       <DialogDescription>         This will permanently deactivate your account       </DialogDescription>        <p>         Are you sure you want to deactivate your account? All of your data will be         permanently removed. This action cannot be undone.       </p>        <!--         You can render additional buttons to dismiss your dialog by setting your         `isOpen` state to `false`.       -->       <button @click="setIsOpen(false)">Cancel</button>       <button @click="handleDeactivate">Deactivate</button>        </DialogPanel>    </Dialog> </template>  <script setup>   import { ref } from 'vue'   import {     Dialog,     DialogPanel,     DialogTitle,     DialogDescription,   } from '@headlessui/vue'    // The open/closed state lives outside of the Dialog and   // is managed by you.   const isOpen = ref(true)    function setIsOpen(value) {      isOpen.value = value    }    function handleDeactivate() {     // ...   } </script>``

[](#styling-the-dialog)
-----------------------

Style the `Dialog` and `DialogPanel` components using the `class` or `style` props like you would with any other element. You can also introduce additional elements if needed to achieve a particular design.

`<template>   <Dialog :open="isOpen" @close="setIsOpen" class="relative z-50">     <div class="fixed inset-0 flex w-screen items-center justify-center p-4">       <DialogPanel class="w-full max-w-sm rounded bg-white">         <DialogTitle>Complete your order</DialogTitle>          <!-- ... -->       </DialogPanel>     </div>   </Dialog> </template>  <script setup>   import { ref } from 'vue'   import { DialogPanel, DialogTitle, DialogDescription } from '@headlessui/vue'    const isOpen = ref(true)    function setIsOpen(value) {     isOpen.value = value   } </script>`

Clicking outside the `DialogPanel` component will close the dialog, so keep that in mind when deciding which element should receive a given style.

[](#adding-a-backdrop)
----------------------

If you'd like to add an overlay or backdrop behind your `DialogPanel` to bring attention to the panel itself, we recommend using a dedicated element just for the backdrop and making it a sibling to your panel container:

`<template>   <Dialog :open="isOpen" @close="setIsOpen" class="relative z-50">     <!-- The backdrop, rendered as a fixed sibling to the panel container -->`

    `<div class="fixed inset-0 bg-black/30" aria-hidden="true" />`

    `<!-- Full-screen container to center the panel -->     <div class="fixed inset-0 flex w-screen items-center justify-center p-4">       <!-- The actual dialog panel -->       <DialogPanel class="w-full max-w-sm rounded bg-white">         <DialogTitle>Complete your order</DialogTitle>          <!-- ... -->       </DialogPanel>     </div>   </Dialog> </template>  <script setup>   import { ref } from 'vue'   import { Dialog, DialogTitle, DialogDescription } from '@headlessui/vue'    const isOpen = ref(true)    function setIsOpen(value) {     isOpen.value = value   } </script>`

This lets you [transition](#transitions) the backdrop and panel independently with their own animations, and rendering it as a sibling ensures that it doesn't interfere with your ability to scroll long dialogs.

Making a dialog scrollable is handled entirely in CSS, and the specific implementation depends on the design you are trying to achieve.

Here's an example where the entire panel container is scrollable, and the panel itself moves as you scroll:

`<template>   <Dialog :open="isOpen" @close="setIsOpen" class="relative z-50">     <!-- The backdrop, rendered as a fixed sibling to the panel container -->     <div class="fixed inset-0 bg-black/30" aria-hidden="true" />      <!-- Full-screen scrollable container -->`

    `<div class="fixed inset-0 w-screen overflow-y-auto">`

      `<!-- Container to center the panel -->          <div class="flex min-h-full items-center justify-center p-4">          <!-- The actual dialog panel -->         <DialogPanel class="w-full max-w-sm rounded bg-white">           <DialogTitle>Complete your order</DialogTitle>            <!-- ... -->         </DialogPanel>       </div>     </div>   </Dialog> </template>  <script setup>   import { ref } from 'vue'   import { Dialog, DialogTitle, DialogDescription } from '@headlessui/vue'    const isOpen = ref(true)    function setIsOpen(value) {     isOpen.value = value   } </script>`

When creating a scrollable dialog with a backdrop, make sure the backdrop is rendered _behind_ the scrollable container, otherwise the scroll wheel won't work when hovering over the backdrop, and the backdrop may obscure the scrollbar and prevent users from clicking it with their mouse.

[](#managing-initial-focus)
---------------------------

For accessibility reasons, your dialog should contain at least one focusable element. By default, the `Dialog` component will focus the first focusable element (by DOM order) once it is rendered, and pressing the Tab key will cycle through all additional focusable elements within the contents.

Focus is trapped within the dialog as long as it is rendered, so tabbing to the end will start cycling back through the beginning again. All other application elements outside of the dialog will be marked as inert and thus not focusable.

If you'd like something other than the first focusable element to receive initial focus when your dialog is initially rendered, you can use the `initialFocus` ref:

`<template>`

  `<Dialog :initialFocus="completeButtonRef" :open="isOpen" @close="setIsOpen">`

    ``<DialogPanel>       <DialogTitle>Complete your order</DialogTitle>        <p>Your order is all ready!</p>        <button @click="setIsOpen(false)">Deactivate</button>       <!-- Use `initialFocus` to force initial focus to a specific ref. -->          <button ref="completeButtonRef" @click="completeOrder">          Complete order       </button>     </DialogPanel>   </Dialog> </template>  <script setup>   import { ref } from 'vue'   import {     Dialog,     DialogPanel,     DialogTitle,     DialogDescription,   } from '@headlessui/vue'      const completeButtonRef = ref(null)    const isOpen = ref(true)    function setIsOpen(value) {     isOpen.value = value   }    function completeOrder() {     // ...   } </script>``

[](#rendering-to-a-portal)
--------------------------

If you've ever implemented a Dialog before, you've probably come across the concept of Portals. Portals let you invoke components from one place in the DOM (for instance deep within your application UI), but actually render to another place in the DOM entirely.

Since Dialogs and their backdrops take up the full page, you typically want to render them as a sibling to the root-most node of your application. That way you can rely on natural DOM ordering to ensure that their content is rendered on top of your existing application UI. This also makes it easy to apply scroll locking to the rest of your application, as well as ensure that your Dialog's contents and backdrop are unobstructed to receive focus and click events.

Because of these accessibility concerns, Headless UI's `Dialog` component actually uses a Portal under-the-hood. This way we can provide features like unobstructed event handling and making the rest of your application inert. So, when using our Dialog, there's no need to use a Portal yourself! We've already taken care of it.

[](#transitions)
----------------

To animate the opening/closing of your dialog, wrap it in Headless UI's `TransitionRoot` component and remove the `open` prop from your `Dialog`, passing your open/closed state to the `show` prop on the `TransitionRoot` instead.

``<template>   <!-- Wrap your dialog in a `TransitionRoot` to add transitions. -->``

  `<TransitionRoot`

    `:show="isOpen"`

    `as="template"`

    `enter="duration-300 ease-out"`

    `enter-from="opacity-0"`

    `enter-to="opacity-100"`

    `leave="duration-200 ease-in"`

    `leave-from="opacity-100"`

    `leave-to="opacity-0"`

  `>`

    `<Dialog @close="setIsOpen">       <DialogPanel>         <DialogTitle>Deactivate account</DialogTitle>         <!-- ... -->         <button @click="isOpen = false">Close</button>       </DialogPanel>     </Dialog>      </TransitionRoot>  </template>  <script setup>   import { ref } from 'vue'   import {        TransitionRoot,      Dialog,     DialogPanel,     DialogTitle,   } from '@headlessui/vue'    const isOpen = ref(true)    function setIsOpen(value) {     isOpen.value = value   } </script>`

To animate your backdrop and panel separately, wrap your `Dialog` with a `TransitionRoot` and wrap your backdrop and panel each with their own `TransitionChild`:

``<template>   <!-- Wrap your dialog in a `TransitionRoot`. -->``

  `<TransitionRoot :show="isOpen" as="template">`

    ``<Dialog @close="setIsOpen">       <!-- Wrap your backdrop in a `TransitionChild`. -->          <TransitionChild            enter="duration-300 ease-out"            enter-from="opacity-0"            enter-to="opacity-100"            leave="duration-200 ease-in"            leave-from="opacity-100"            leave-to="opacity-0"          >          <div class="fixed inset-0 bg-black/30" />          </TransitionChild>        <!-- Wrap your panel in a `TransitionChild`. -->          <TransitionChild            enter="duration-300 ease-out"            enter-from="opacity-0 scale-95"            enter-to="opacity-100 scale-100"            leave="duration-200 ease-in"            leave-from="opacity-100 scale-100"            leave-to="opacity-0 scale-95"          >          <DialogPanel>           <DialogTitle>Deactivate account</DialogTitle>           <!-- ... -->         </DialogPanel>          </TransitionChild>      </Dialog>   </TransitionRoot> </template>  <script setup>   import { ref } from 'vue'   import {        TransitionRoot,        TransitionChild,      Dialog,     DialogPanel,     DialogTitle,   } from '@headlessui/vue'    const isOpen = ref(true)    function setIsOpen(value) {     isOpen.value = value   } </script>``

To learn more about transitions in Headless UI, read the dedicated [Transition documentation](https://headlessui.com/v1/vue/transition).

[](#accessibility-notes)
------------------------

### [](#focus-management)

When the Dialog's `open` prop is `true`, the contents of the Dialog will render and focus will be moved inside the Dialog and trapped there. The first focusable element according to DOM order will receive focus, although you can use the `initialFocus` ref to control which element receives initial focus. Pressing Tab on an open Dialog cycles through all the focusable elements.

### [](#mouse-interaction)

When a `Dialog` is rendered, clicking outside of the `DialogPanel` will close the `Dialog`.

No mouse interaction to open the `Dialog` is included out-of-the-box, though typically you will wire a `<button />` element up with a `click` handler that toggles the Dialog's `open` prop to `true`.

### [](#keyboard-interaction)

### [](#other)

When a Dialog is open, scroll is locked and the rest of your application UI is hidden from screen readers.

All relevant ARIA attributes are automatically managed.

[](#component-api)
------------------

### [](#dialog)

The main Dialog component.

### [](#dialog-panel)

This indicates the panel of your actual Dialog. Clicking outside of this component will emit the `close` event on the `Dialog` component.

### [](#dialog-title)

This is the title for your Dialog. When this is used, it will set the `aria-labelledby` on the Dialog.

### [](#dialog-description)

This is the description for your Dialog. When this is used, it will set the `aria-describedby` on the Dialog.

### [](#dialog-overlay)

As of Headless UI v1.6, `DialogOverlay` is deprecated, see the [release notes](https://github.com/tailwindlabs/headlessui/releases/tag/%40headlessui%2Fvue%40v1.6.0) for migration instructions.</content>
</page>

<page>
  <title>Headless UI</title>
  <url>https://headlessui.com/v1/vue/popover</url>
  <content>Popovers are perfect for floating panels with arbitrary content like navigation menus, mobile menus and flyout menus.

[](#installation)
-----------------

To get started, install Headless UI via npm.

Please note that **this library only supports Vue 3**.

`npm install @headlessui/vue`

[](#basic-example)
------------------

Popovers are built using the `Popover`, `PopoverButton`, and `PopoverPanel` components.

Clicking the `PopoverButton` will automatically open/close the `PopoverPanel`. When the panel is open, clicking anywhere outside of its contents, pressing the Escape key, or tabbing away from it will close the Popover.

`<template>   <Popover class="relative">     <PopoverButton>Solutions</PopoverButton>      <PopoverPanel class="absolute z-10">       <div class="grid grid-cols-2">         <a href="/analytics">Analytics</a>         <a href="/engagement">Engagement</a>         <a href="/security">Security</a>         <a href="/integrations">Integrations</a>       </div>        <img src="/solutions.jpg" alt="" />     </PopoverPanel>   </Popover> </template>  <script setup>   import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue' </script>`

These components are completely unstyled, so how you style your `Popover` is up to you. In our example we're using absolute positioning on the `PopoverPanel` to position it near the `PopoverButton` and not disturb the normal document flow.

[](#styling-different-states)
-----------------------------

Headless UI keeps track of a lot of state about each component, like which listbox option is currently selected, whether a popover is open or closed, or which item in a popover is currently active via the keyboard.

But because the components are headless and completely unstyled out of the box, you can't _see_ this information in your UI until you provide the styles you want for each state yourself.

### [](#using-slots)

Each component exposes information about its current state via [slot props](https://vuejs.org/api/built-in-directives.html#v-slot) that you can use to conditionally apply different styles or render different content.

For example, the `Popover` component exposes an `open` state, which tells you if the popover is currently open.

`<template>`

  `<Popover v-slot="{ open }">`

    ``<!-- Use the `open` state to conditionally change the direction of the chevron icon. -->     <PopoverButton>       Solutions          <ChevronDownIcon :class="{ 'rotate-180 transform': open }" />      </PopoverButton>      <PopoverPanel>       <a href="/insights">Insights</a>       <a href="/automations">Automations</a>       <a href="/reports">Reports</a>     </PopoverPanel>   </Popover> </template>  <script setup>   import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'   import { ChevronDownIcon } from '@heroicons/vue/20/solid' </script>``

For a complete list of all the available slot props, see the [component API documentation](#component-api).

### [](#using-data-attributes)

Each component also exposes information about its current state via a `data-headlessui-state` attribute that you can use to conditionally apply different styles.

When any of the states in the [slot prop API](#component-api) are `true`, they will be listed in this attribute as space-separated strings so you can target them with a [CSS attribute selector](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors) in the form `[attr~=value]`.

For example, here's what the `Popover` component renders when the popover is open:

``<!-- Rendered `Popover` --> <div data-headlessui-state="open">   <button data-headlessui-state="open">Solutions</button>   <div data-headlessui-state="open">     <a href="/insights">Insights</a>     <a href="/automations">Automations</a>     <a href="/reports">Reports</a>   </div> </div>``

If you are using [Tailwind CSS](https://tailwindcss.com/), you can use the [@headlessui/tailwindcss](https://github.com/tailwindlabs/headlessui/tree/main/packages/%40headlessui-tailwindcss) plugin to target this attribute with modifiers like `ui-open:*`:

`<template>   <Popover>     <PopoverButton>       Solutions`

      `<ChevronDownIcon class="ui-open:rotate-180 ui-open:transform" />`

    `</PopoverButton>      <PopoverPanel>       <a href="/insights">Insights</a>       <a href="/automations">Automations</a>       <a href="/reports">Reports</a>     </PopoverPanel>   </Popover> </template>  <script setup>   import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'   import { ChevronDownIcon } from '@heroicons/vue/20/solid' </script>`

[](#showing-hiding-the-popover)
-------------------------------

By default, your `PopoverPanel` will be shown/hidden automatically based on the internal open state tracked within the `Popover` component itself.

``<template>   <Popover>     <PopoverButton>Solutions</PopoverButton>     <!--       By default, the `PopoverPanel` will automatically show/hide       when the `PopoverButton` is pressed.     -->     <PopoverPanel>       <!-- ... -->     </PopoverPanel>   </Popover> </template>  <script setup>   import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue' </script>``

If you'd rather handle this yourself (perhaps because you need to add an extra wrapper element for one reason or another), you can pass a `static` prop to the `PopoverPanel` to tell it to always render, and then use the `open` slot prop to control when the panel is shown/hidden yourself.

`<template>`

  `<Popover v-slot="{ open }">`

    ``<PopoverButton>Solutions</PopoverButton>      <div v-if="open">          <!--          Using the `static` prop, the `PopoverPanel` is always          rendered and the `open` state is ignored.        -->       <PopoverPanel static>         <!-- ... -->       </PopoverPanel>     </div>   </Popover> </template>  <script setup>   import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue' </script>``

[](#closing-popovers-manually)
------------------------------

Since popovers can contain interactive content like form controls, we can't automatically close them when you click something inside of them like we can with `Menu` components.

To close a popover manually when clicking a child of its panel, render that child as a `PopoverButton`. You can use the `:as` prop to customize which element is being rendered.

`<template>   <Popover>     <PopoverButton>Solutions</PopoverButton>      <PopoverPanel>`

      `<PopoverButton :as="MyLink" href="/insights">Insights</PopoverButton>`

      `<!-- ... -->     </PopoverPanel>   </Popover> </template>  <script setup>   import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'   import MyLink from './MyLink' </script>`

Alternatively, `Popover` and `PopoverPanel` expose a `close()` slot prop which you can use to imperatively close the panel, say after running an async action:

`<template>   <Popover>     <PopoverButton>Solutions</PopoverButton>`

    `<PopoverPanel v-slot="{ close }">`

      `<button @click="accept(close)">Read and accept</button>`

    `</PopoverPanel>`

  `</Popover> </template>  <script setup>   import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'      async function accept(close) {        await fetch('/accept-terms', { method: 'POST' })        close()      }</script>`

By default the `PopoverButton` receives focus after calling `close()`, but you can change this by passing a ref into `close(ref)`.

[](#adding-an-overlay)
----------------------

If you'd like to style a backdrop over your application UI whenever you open a Popover, use the `PopoverOverlay` component:

`<template>   <Popover v-slot="{ open }">     <PopoverButton>Solutions</PopoverButton>`

    `<PopoverOverlay class="fixed inset-0 bg-black opacity-30" />`

    `<PopoverPanel>       <!-- ... -->     </PopoverPanel>   </Popover> </template>  <script setup>   import {     Popover,     PopoverOverlay,     PopoverButton,     PopoverPanel,   } from '@headlessui/vue' </script>`

In this example, we put the `PopoverOverlay` before the `Panel` in the DOM so that it doesn't cover up the panel's contents.

But like all the other components, `PopoverOverlay` is completely headless, so how you style it is up to you.

[](#transitions)
----------------

To animate the opening/closing of your Popover's panel, you can use Vue's built-in `<transition>` element. All you need to do is wrap your `PopoverPanel` in a `<transition>`, and the transition will be applied automatically.

``<template>   <Popover>     <PopoverButton>Solutions</PopoverButton>      <!-- Use the built-in `transition` component to add transitions. -->``

    `<transition`

      `enter-active-class="transition duration-200 ease-out"`

      `enter-from-class="translate-y-1 opacity-0"`

      `enter-to-class="translate-y-0 opacity-100"`

      `leave-active-class="transition duration-150 ease-in"`

      `leave-from-class="translate-y-0 opacity-100"`

      `leave-to-class="translate-y-1 opacity-0"`

    `>`

      `<PopoverPanel>         <!-- ... -->       </PopoverPanel>     </transition>   </Popover> </template>  <script setup>   import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue' </script>`

If you'd like to coordinate multiple transitions for different children of your Popover, check out the [Transition component included in Headless UI](https://headlessui.com/v1/vue/transition).

When rendering several related Popovers, for example in a site's header navigation, use the `PopoverGroup` component. This ensures panels stay open while users are tabbing between Popovers within a group, but closes any open panel once the user tabs outside of the group:

`<template>`

  `<PopoverGroup>`

    `<Popover>       <PopoverButton>Product</PopoverButton>       <PopoverPanel>         <!-- ... -->       </PopoverPanel>     </Popover>      <Popover>       <PopoverButton>Solutions</PopoverButton>       <PopoverPanel>         <!-- ... -->       </PopoverPanel>     </Popover>      </PopoverGroup>  </template>  <script setup>   import {     PopoverGroup,     Popover,     PopoverButton,     PopoverPanel,   } from '@headlessui/vue' </script>`

[](#rendering-as-different-elements)
------------------------------------

`Popover` and its subcomponents each render a default element that is sensible for that component: the `Popover`, `Overlay`, `Panel` and `Group` components all render a `<div>`, and the `Button` component renders a `<button>`.

This is easy to change using the `as` prop, which exists on every component.

``<template>   <!-- Render a `nav` instead of a `div` -->``

  `<Popover as="nav">`

    ``<PopoverButton>Solutions</PopoverButton>      <!-- Render a `form` instead of a `div` -->        <PopoverPanel as="form"><!-- ... --></PopoverPanel>    </Popover> </template>  <script setup>   import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue' </script>``

[](#accessibility-notes)
------------------------

### [](#focus-management)

Pressing Tab on an open panel will focus the first focusable element within the panel's contents. If a `PopoverGroup` is being used, Tab cycles from the end of an open panel's content to the next Popover's button.

### [](#mouse-interaction)

Clicking a `PopoverButton` toggles a panel open and closed. Clicking anywhere outside of an open panel will close that panel.

### [](#keyboard-interaction)

### [](#other)

Nested Popovers are supported, and all panels will close correctly whenever the root panel is closed.

All relevant ARIA attributes are automatically managed.

[](#when-to-use-a-popover)
--------------------------

Here's how Popovers compare to other similar components:

*   **`<Menu />`**. Popovers are more general-purpose than Menus. Menus only support very restricted content and have specific accessibility semantics. Arrow keys also navigate a Menu's items. Menus are best for UI elements that resemble things like the menus you'd find in the title bar of most operating systems. If your floating panel has images or more markup than simple links, use a Popover.
    
*   **`<Disclosure />`**. Disclosures are useful for things that typically reflow the document, like Accordions. Popovers also have extra behavior on top of Disclosures: they render overlays, and are closed when the user either clicks the overlay (by clicking outside of the Popover's content) or presses the escape key. If your UI element needs this behavior, use a Popover instead of a Disclosure.
    
*   **`<Dialog />`**. Dialogs are meant to grab the user's full attention. They typically render a floating panel in the center of the screen, and use a backdrop to dim the rest of the application's contents. They also capture focus and prevent tabbing away from the Dialog's contents until the Dialog is dismissed. Popovers are more contextual, and are usually positioned near the element that triggered them.
    

[](#component-api)
------------------

### [](#popover)

The main Popover component.

### [](#popover-overlay)

This can be used to create an overlay for your Popover component. Clicking on the overlay will close the Popover.

### [](#popover-button)

This is the trigger component to toggle a Popover. You can also use this `PopoverButton` component inside a `PopoverPanel`, if you do so, then it will behave as a `close` button. We will also make sure to provide the correct `aria-*` attributes onto the button.

### [](#popover-panel)

This component contains the contents of your Popover.

### [](#popover-group)

Link related sibling popovers by wrapping them in a `PopoverGroup`. Tabbing out of one `PopoverPanel` will focus the next popover's `PopoverButton`, and tabbing outside of the `PopoverGroup` completely will close all popovers inside the group.</content>
</page>

<page>
  <title>Headless UI</title>
  <url>https://headlessui.com/v1/vue/radio-group</url>
  <content>Radio Groups give you the same functionality as native HTML radio inputs, without any of the styling. They're perfect for building out custom UIs for selectors.

[](#installation)
-----------------

To get started, install Headless UI via npm.

Please note that **this library only supports Vue 3**.

`npm install @headlessui/vue`

[](#basic-example)
------------------

Radio Groups are built using the `RadioGroup`, `RadioGroupLabel`, and `RadioGroupOption` components.

Clicking an option will select it, and when the Radio Group is focused, the arrow keys will change the selected option.

`<template>   <RadioGroup v-model="plan">     <RadioGroupLabel>Plan</RadioGroupLabel>     <RadioGroupOption v-slot="{ checked }" value="startup">       <span :class="checked ? 'bg-blue-200' : ''">Startup</span>     </RadioGroupOption>     <RadioGroupOption v-slot="{ checked }" value="business">       <span :class="checked ? 'bg-blue-200' : ''">Business</span>     </RadioGroupOption>     <RadioGroupOption v-slot="{ checked }" value="enterprise">       <span :class="checked ? 'bg-blue-200' : ''">Enterprise</span>     </RadioGroupOption>   </RadioGroup> </template>  <script setup>   import { ref } from 'vue'   import {     RadioGroup,     RadioGroupLabel,     RadioGroupOption,   } from '@headlessui/vue'    const plan = ref('startup') </script>`

[](#styling-different-states)
-----------------------------

Headless UI keeps track of a lot of state about each component, like which radiogroup option is currently selected, whether a popover is open or closed, or which item in a radiogroup is currently active via the keyboard.

But because the components are headless and completely unstyled out of the box, you can't _see_ this information in your UI until you provide the styles you want for each state yourself.

### [](#using-slots)

Each component exposes information about its current state via [slot props](https://vuejs.org/api/built-in-directives.html#v-slot) that you can use to conditionally apply different styles or render different content.

For example, the `RadioGroupOption` component exposes an `active` state, which tells you if the item is currently focused via the mouse or keyboard.

``<template>   <RadioGroup v-model="plan">     <RadioGroupLabel>Plan</RadioGroupLabel>     <!-- Use the `active` state to conditionally style the active option. -->     <!-- Use the `checked` state to conditionally style the checked option. -->     <RadioGroupOption       v-for="plan in plans"       :key="plan"       :value="plan"       as="template"``

      `v-slot="{ active, checked }"`

    `>       <li         :class="{            'bg-blue-500 text-white': active,            'bg-white text-black': !active,          }"       >            <CheckIcon v-show="checked" />          {{ plan }}       </li>     </RadioGroupOption>   </RadioGroup> </template>  <script setup>   import { ref } from 'vue'   import {     RadioGroup,     RadioGroupLabel,     RadioGroupOption,   } from '@headlessui/vue'   import { CheckIcon } from '@heroicons/vue/20/solid'    const plans = ['Startup', 'Business', 'Enterprise']   const plan = ref(plans[0]) </script>`

For a complete list of all the available slot props, see the [component API documentation](#component-api).

### [](#using-data-attributes)

Each component also exposes information about its current state via a `data-headlessui-state` attribute that you can use to conditionally apply different styles.

When any of the states in the [slot prop API](#component-api) are `true`, they will be listed in this attribute as space-separated strings so you can target them with a [CSS attribute selector](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors) in the form `[attr~=value]`.

For example, here's what the `RadioGroup` component with some child `RadioGroupOption` components renders when the radiogroup is open and the second item is `active`:

``<!-- Rendered `RadioGroup` --> <ul data-headlessui-state="open">   <li data-headlessui-state="">Wade Cooper</li>   <li data-headlessui-state="active selected">Arlene Mccoy</li>   <li data-headlessui-state="">Devon Webb</li> </ul>``

If you are using [Tailwind CSS](https://tailwindcss.com/), you can use the [@headlessui/tailwindcss](https://github.com/tailwindlabs/headlessui/tree/main/packages/%40headlessui-tailwindcss) plugin to target this attribute with modifiers like `ui-open:*` and `ui-active:*`:

`<template>   <RadioGroup v-model="plan">     <RadioGroupLabel>Plan</RadioGroupLabel>     <RadioGroupOption       v-for="plan in plans"       :key="plan"       :value="plan"       as="template"     >       <li`

        `class="ui-active:bg-blue-500 ui-active:text-white ui-not-active:bg-white ui-not-active:text-black"`

      `>            <CheckIcon class="hidden ui-checked:block" />          {{ plan }}       </li>     </RadioGroupOption>   </RadioGroup> </template>  <script setup>   import { ref } from 'vue'   import {     RadioGroup,     RadioGroupLabel,     RadioGroupOption,   } from '@headlessui/vue'   import { CheckIcon } from '@heroicons/vue/20/solid'    const plans = ['Startup', 'Business', 'Enterprise']   const plan = ref(plans[0]) </script>`

[](#binding-objects-as-values)
------------------------------

Unlike native HTML form controls which only allow you to provide strings as values, Headless UI supports binding complex objects as well.

`<template>`

  `<RadioGroup v-model="plan">`

    `<RadioGroupLabel>Plan</RadioGroupLabel>        <RadioGroupOption v-for="plan in plans" :key="plan.id" :value="plan">        {{ plan.name }}     </RadioGroupOption>   </RadioGroup> </template>  <script setup>   import { ref } from 'vue'   import {     RadioGroup,     RadioGroupLabel,     RadioGroupOption,   } from '@headlessui/vue'      const plans = [        { id: 1, name: 'Startup' },        { id: 2, name: 'Business' },        { id: 3, name: 'Enterprise' },      ]    const plan = ref(plans[1]) </script>`

When binding objects as values, it's important to make sure that you use the _same instance_ of the object as both the `value` of the `RadioGroup` as well as the corresponding `RadioGroupOption`, otherwise they will fail to be equal and cause the radiogroup to behave incorrectly.

To make it easier to work with different instances of the same object, you can use the `by` prop to compare the objects by a particular field instead of comparing object identity:

`<template>   <RadioGroup     :modelValue="modelValue"     @update:modelValue="value => emit('update:modelValue', value)"`

    `by="id"`

  `>     <RadioGroupLabel>Assignee</RadioGroupLabel>     <RadioGroupOption v-for="plan in plans" :key="plan.id" :value="plan">       {{ plan.name }}     </RadioGroupOption>   </RadioGroup> </template>  <script setup>   import {     RadioGroup,     RadioGroupLabel,     RadioGroupOption,   } from '@headlessui/vue'    const props = defineProps({ modelValue: Object })   const emit = defineEmits(['update:modelValue'])    const plans = [     { id: 1, name: 'Startup' },     { id: 2, name: 'Business' },     { id: 3, name: 'Enterprise' },   ] </script>`

You can also pass your own comparison function to the `by` prop if you'd like complete control over how objects are compared:

`<template>   <RadioGroup     :modelValue="modelValue"     @update:modelValue="value => emit('update:modelValue', value)"`

    `:by="comparePlans"`

  `>     <RadioGroupLabel>Assignee</RadioGroupLabel>     <RadioGroupOption v-for="plan in plans" :key="plan.id" :value="plan">       {{ plan.name }}     </RadioGroupOption>   </RadioGroup> </template>  <script setup>   import {     RadioGroup,     RadioGroupLabel,     RadioGroupOption,   } from '@headlessui/vue'    const props = defineProps({ modelValue: Object })   const emit = defineEmits(['update:modelValue'])      function comparePlans(a, b) {        return a.name.toLowerCase() === b.name.toLowerCase()      }    const plans = [     { id: 1, name: 'Startup' },     { id: 2, name: 'Business' },     { id: 3, name: 'Enterprise' },   ] </script>`

[](#using-with-html-forms)
--------------------------

If you add the `name` prop to your listbox, hidden `input` elements will be rendered and kept in sync with your selected value.

`<template>   <form action="/billing" method="post">`

    `<RadioGroup v-model="plan" name="plan">`

      `<RadioGroupLabel>Plan</RadioGroupLabel>       <RadioGroupOption v-for="plan in plans" :key="plan" :value="plan">         {{ plan }}       </RadioGroupOption>     </RadioGroup>     <button>Submit</button>   </form> </template>  <script setup>   import { ref } from 'vue'   import {     RadioGroup,     RadioGroupLabel,     RadioGroupOption,   } from '@headlessui/vue'    const plans = ['startup', 'business', 'enterprise']   const plan = ref(plans[0]) </script>`

This lets you use a radio group inside a native HTML `<form>` and make traditional form submissions as if your radio group was a native HTML form control.

Basic values like strings will be rendered as a single hidden input containing that value, but complex values like objects will be encoded into multiple inputs using a square bracket notation for the names.

`<input type="hidden" name="plan" value="startup" />`

[](#using-as-an-uncontrolled-component)
---------------------------------------

If you provide a `defaultValue` prop to the `RadioGroup` instead of a `value`, Headless UI will track its state internally for you, allowing you to use it as an [uncontrolled component](https://reactjs.org/docs/uncontrolled-components.html).

`<template>   <form action="/billing" method="post">`

    `<RadioGroup name="plan" :defaultValue="plans[0]">`

      `<RadioGroupLabel>Plan</RadioGroupLabel>       <RadioGroupOption v-for="plan in plans" :key="plan" :value="plan">         {{ plan }}       </RadioGroupOption>     </RadioGroup>     <button>Submit</button>   </form> </template>  <script setup>   import {     RadioGroup,     RadioGroupLabel,     RadioGroupOption,   } from '@headlessui/vue'    const plans = ['startup', 'business', 'enterprise'] </script>`

This can simplify your code when using the combobox [with HTML forms](#using-with-html-forms) or with form APIs that collect their state using [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData) instead of tracking it using React state.

Any `@update:modelValue` prop you provide will still be called when the component's value changes in case you need to run any side effects, but you won't need to use it to track the component's state yourself.

[](#using-the-label-and-description-components)
-----------------------------------------------

You can use the `RadioGroupLabel` and `RadioGroupDescription` components to mark up each option's contents. Doing so will automatically link each component to its ancestor `RadioGroupOption` component via the `aria-labelledby` and `aria-describedby` attributes and autogenerated `id`s, improving the semantics and accessibility of your custom selector.

By default, `RatioGroupLabel` renders a `label` element and `RadioGroupDescription` renders a `<div>`. These can also be customized using the `as` prop, as described in the API docs below.

Note also that `Label`s and `Description`s can be nested. Each one will refer to its nearest ancestor component, whether than ancestor is a `RadioGroupOption` or the root `RadioGroup` itself.

``<template>   <RadioGroup v-model="plan">     <!-- This label is for the root `RadioGroup` -->``

    `<RadioGroupLabel class="sr-only">Plan</RadioGroupLabel>`

    ``<div class="rounded-md bg-white">       <RadioGroupOption value="startup" as="template" v-slot="{ checked }">         <div           :class='checked ? "bg-indigo-50 border-indigo-200" : "border-gray-200"'           class="relative flex border p-4"         >           <div class="flex flex-col">             <!-- This label is for the `RadioGroupOption` -->                <RadioGroupLabel as="template">                  <span                    :class='checked ? "text-indigo-900" : "text-gray-900"'                    class="block text-sm font-medium"                    >Startup</span                  >                </RadioGroupLabel>              <!-- This description is for the `RadioGroupOption` -->                <RadioGroupDescription as="template">                  <span                    :class='checked ? "text-indigo-700" : "text-gray-500"'                    class="block text-sm"                    >Up to 5 active job postings</span                  >                </RadioGroupDescription>            </div>         </div>       </RadioGroupOption>     </div>   </RadioGroup> </template>  <script setup>   import { ref } from 'vue'   import {     RadioGroup,     RadioGroupLabel,     RadioGroupOption,     RadioGroupDescription,   } from '@headlessui/vue'    const plan = ref('startup') </script>``

[](#accessibility-notes)
------------------------

### [](#mouse-interaction)

Clicking a `RadioGroupOption` will select it.

### [](#keyboard-interaction)

All interactions apply when a `RadioGroup` component is focused.

### [](#other)

All relevant ARIA attributes are automatically managed.

[](#component-api)
------------------

### [](#radio-group)

The main Radio Group component.

### [](#radio-group-option)

The wrapper component for each selectable option.

### [](#radio-group-label)

Renders an element whose `id` attribute is automatically generated, and is then linked to its nearest ancestor `RadioGroup` or `RadioGroupOption` component via the `aria-labelledby` attribute.

### [](#radio-group-description)

Renders an element whose `id` attribute is automatically generated, and is then linked to its nearest ancestor `RadioGroup` or `RadioGroupOption` component via the `aria-describedby` attribute.</content>
</page>

<page>
  <title>Headless UI</title>
  <url>https://headlessui.com/v1/vue/tabs</url>
  <content>Easily create accessible, fully customizable tab interfaces, with robust focus management and keyboard navigation support.

[](#installation)
-----------------

To get started, install Headless UI via npm:

`npm install @headlessui/vue`

[](#basic-example)
------------------

Tabs are built using the `TabGroup`, `TabList`, `Tab`, `TabPanels`, and `TabPanel` components. By default the first tab is selected, and clicking on any tab or selecting it with the keyboard will activate the corresponding panel.

`<template>   <TabGroup>     <TabList>       <Tab>Tab 1</Tab>       <Tab>Tab 2</Tab>       <Tab>Tab 3</Tab>     </TabList>     <TabPanels>       <TabPanel>Content 1</TabPanel>       <TabPanel>Content 2</TabPanel>       <TabPanel>Content 3</TabPanel>     </TabPanels>   </TabGroup> </template>  <script setup>   import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue' </script>`

[](#styling-different-states)
-----------------------------

Headless UI keeps track of a lot of state about each component, like which tab option is currently checked, whether a popover is open or closed, or which item in a menu is currently active via the keyboard.

But because the components are headless and completely unstyled out of the box, you can't _see_ this information in your UI until you provide the styles you want for each state yourself.

### [](#using-slots)

Each component exposes information about its current state via [slot props](https://vuejs.org/api/built-in-directives.html#v-slot) that you can use to conditionally apply different styles or render different content.

For example, the `Tab` component exposes a `selected` state, which tells you if the tab is currently selected.

``<template>   <TabGroup>     <TabList>       <!-- Use the `selected` state to conditionally style the selected tab. -->``

      `<Tab as="template" v-slot="{ selected }">`

        `<button              :class="{ 'bg-blue-500 text-white': selected, 'bg-white text-black': !selected }"          >           Tab 1         </button>       </Tab>       <!-- ... -->     </TabList>     <TabPanels>       <TabPanel>Content 1</TabPanel>       <!-- ... -->     </TabPanels>   </TabGroup> </template>  <script setup>   import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue' </script>`

For the complete slot props API for each component, see the [component API documentation](#component-api).

### [](#using-data-attributes)

Each component also exposes information about its current state via a `data-headlessui-state` attribute that you can use to conditionally apply different styles.

When any of the states in the [slot props API](#component-api) are `true`, they will be listed in this attribute as space-separated strings so you can target them with a [CSS attribute selector](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors) in the form `[attr~=value]`.

For example, here's what the `TabGroup` component with some child `Tab` components renders when the second tab is `selected`:

``<!-- Rendered `TabGroup` --> <div>   <button data-headlessui-state="">Tab 1</button>   <button data-headlessui-state="selected">Tab 2</button>   <button data-headlessui-state="">Tab 3</button> </div> <div>   <div data-headlessui-state="">Content 1</div>   <div data-headlessui-state="selected">Content 2</div>   <div data-headlessui-state="">Content 3</div> </div>``

If you are using [Tailwind CSS](https://tailwindcss.com/), you can use the [@headlessui/tailwindcss](https://github.com/tailwindlabs/headlessui/tree/main/packages/%40headlessui-tailwindcss) plugin to target this attribute with modifiers like `ui-open:*`:

`<template>   <TabGroup>     <TabList>       <Tab`

        `class="ui-selected:bg-blue-500 ui-selected:text-white ui-not-selected:bg-white ui-not-selected:text-black"`

      `>         Tab 1       </Tab>       <!-- ... -->     </TabList>     <TabPanels>       <TabPanel>Content 1</TabPanel>       <!-- ... -->     </TabPanels>   </TabGroup> </template>  <script setup>   import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue' </script>`

[](#disabling-a-tab)
--------------------

To disable a tab, use the `disabled` prop on the `Tab` component. Disabled tabs cannot be selected with the mouse, and are also skipped when navigating the tab list using the keyboard.

`<template>   <TabGroup>     <TabList>       <Tab>Tab 1</Tab>`

      `<Tab disabled>Tab 2</Tab>`

      `<Tab>Tab 3</Tab>     </TabList>     <TabPanels>       <TabPanel>Content 1</TabPanel>       <TabPanel>Content 2</TabPanel>       <TabPanel>Content 3</TabPanel>     </TabPanels>   </TabGroup> </template>  <script setup>   import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue' </script>`

[](#manually-activating-tabs)
-----------------------------

By default, tabs are automatically selected as the user navigates through them using the arrow keys.

If you'd rather not change the current tab until the user presses `Enter` or `Space`, use the `manual` prop on the `TabGroup` component. This can be helpful if selecting a tab performs an expensive operation and you don't want to run it unnecessarily.

`<template>`

  `<TabGroup manual>`

    `<TabList>       <Tab>Tab 1</Tab>       <Tab>Tab 2</Tab>       <Tab>Tab 3</Tab>     </TabList>     <TabPanels>       <TabPanel>Content 1</TabPanel>       <TabPanel>Content 2</TabPanel>       <TabPanel>Content 3</TabPanel>     </TabPanels>   </TabGroup> </template>  <script setup>   import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue' </script>`

The `manual` prop has no impact on mouse interactions — tabs will still be selected as soon as they are clicked.

[](#vertical-tabs)
------------------

If you've styled your `TabList` to appear vertically, use the `vertical` prop to enable navigating with the up and down arrow keys instead of left and right, and to update the `aria-orientation` attribute for assistive technologies.

`<template>`

  `<TabGroup vertical>`

    `<TabList>       <Tab>Tab 1</Tab>       <Tab>Tab 2</Tab>       <Tab>Tab 3</Tab>     </TabList>     <TabPanels>       <TabPanel>Content 1</TabPanel>       <TabPanel>Content 2</TabPanel>       <TabPanel>Content 3</TabPanel>     </TabPanels>   </TabGroup> </template>  <script setup>   import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue' </script>`

[](#specifying-the-default-tab)
-------------------------------

To change which tab is selected by default, use the `:defaultIndex="number"` prop on the `TabGroup` component.

`<template>`

  `<TabGroup :defaultIndex="1">`

    `<TabList>       <Tab>Tab 1</Tab>          <!-- Selects this tab by default -->          <Tab>Tab 2</Tab>        <Tab>Tab 3</Tab>     </TabList>     <TabPanels>       <TabPanel>Content 1</TabPanel>          <!-- Displays this tab by default -->          <TabPanel>Content 2</TabPanel>        <TabPanel>Content 3</TabPanel>     </TabPanels>   </TabGroup> </template>  <script setup>   import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue' </script>`

If you happen to provide an index that is out of bounds, then the last non-disabled tab will be selected on initial render. (For example, `<TabGroup :defaultIndex="5"` in the example above would render the third panel as selected.)

[](#listening-for-changes)
--------------------------

To run a function whenever the selected tab changes, use the `@change` event on the `TabGroup` component.

`<template>`

  `<TabGroup @change="changeTab">`

    `<TabList>       <Tab>Tab 1</Tab>       <Tab>Tab 2</Tab>       <Tab>Tab 3</Tab>     </TabList>     <TabPanels>       <TabPanel>Content 1</TabPanel>       <TabPanel>Content 2</TabPanel>       <TabPanel>Content 3</TabPanel>     </TabPanels>   </TabGroup> </template>  <script setup>   import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue'      function changeTab(index) {        console.log('Changed active tab to:', index)      }</script>`

[](#controlling-the-active-tab)
-------------------------------

The tabs component can also be used as a controlled component. To do this, provide the `selectedIndex` and manage the state yourself.

`<template>`

  `<TabGroup :selectedIndex="selectedTab" @change="changeTab">`

    `<TabList>       <Tab>Tab 1</Tab>       <Tab>Tab 2</Tab>       <Tab>Tab 3</Tab>     </TabList>     <TabPanels>       <TabPanel>Content 1</TabPanel>       <TabPanel>Content 2</TabPanel>       <TabPanel>Content 3</TabPanel>     </TabPanels>   </TabGroup> </template>  <script setup>   import { ref } from 'vue'   import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue'      const selectedTab = ref(0)      function changeTab(index) {      selectedTab.value = index      }</script>`

[](#accessibility-notes)
------------------------

### [](#mouse-interaction)

Clicking a `Tab` will select that tab and display the corresponding `TabPanel`.

### [](#keyboard-interaction)

All interactions apply when a `Tab` component is focused.

### [](#other)

All relevant ARIA attributes are automatically managed.

For a full reference on all accessibility features implemented in `Tabs`, see [the ARIA spec on Tabs](https://www.w3.org/TR/wai-aria-practices-1.2/#tabpanel).

[](#component-api)
------------------

### [](#tab-group)

The main TabGroup component.</content>
</page>

<page>
  <title>Headless UI</title>
  <url>https://headlessui.com/v1/vue/transition</url>
  <content>The Transition component takes Vue's built-in transition element one step further by letting you coordinate nested child transitions from a single root component.

[](#installation)
-----------------

To get started, install Headless UI via npm.

Please note that **this library only supports Vue 3**.

`npm install @headlessui/vue`

[](#about-this-component)
-------------------------

Vue has a built-in `<transition>` component that works great with Tailwind's class-based styling approach, as well as alongside other Headless UI components. In fact, most of the demos and code snippets you'll find for the other Vue components on this site rely on this built-in transition exclusively.

But there's one exception: nested child transitions. This technique is needed when you want to coordinate different animations for different child elements – for example, fading in a Dialog's backdrop, while at the same time sliding in the contents of the Dialog from one side of the screen.

The only way to achieve this effect using the built-in `<transition>` element is to manually synchronize each of the child transitions, and even then the approach can be buggy and error-prone.

That's why we've included a `<TransitionRoot />` component in Headless UI. Its API is similar to Vue's own element, but it also provides a means for coordinating multiple transitions via the included `<TransitionChild />` component, as described below.

For all components except `Dialog`, you may use Vue's built-in `<transition>` element whenever you're applying a single transition. For animating a `Dialog`, or coordinating multiple transitions on any other component, use the `TransitionRoot` component from Headless UI instead.

[](#basic-example)
------------------

The `TransitionRoot` accepts a `show` prop that controls whether the children should be shown or hidden, and a set of lifecycle props (like `enter-from`, and `leave-to`) that let you add CSS classes at specific phases of a transition.

`<template>   <button @click="isShowing = !isShowing">Toggle</button>   <TransitionRoot     :show="isShowing"     enter="transition-opacity duration-75"     enter-from="opacity-0"     enter-to="opacity-100"     leave="transition-opacity duration-150"     leave-from="opacity-100"     leave-to="opacity-0"   >     I will fade in and out   </TransitionRoot> </template>  <script setup>   import { ref } from 'vue'   import { TransitionRoot } from '@headlessui/vue'    const isShowing = ref(true) </script>`

[](#showing-and-hiding-content)
-------------------------------

Wrap the content that should be conditionally rendered in a `<TransitionRoot>` component, and use the `show` prop to control whether the content should be visible or hidden.

`<template>   <button @click="isShowing = !isShowing">Toggle</button>`

  `<TransitionRoot :show="isShowing">`

    `I will appear and disappear.   </TransitionRoot> </template>  <script setup>   import { ref } from 'vue'   import { TransitionRoot } from '@headlessui/vue'    const isShowing = ref(true) </script>`

[](#rendering-as-a-different-element)
-------------------------------------

By default, the transition components will render a `div` element.

Use the `as` prop to render a component as a different element or as your own custom component. Any other HTML attributes (like `class`) can be added directly to the `TransitionRoot` the same way they would be to regular elements.

`<template>   <button @click="isShowing = !isShowing">Toggle</button>`

  `<TransitionRoot :show="isShowing" as="a" href="/my-url" class="font-bold">`

    `I will appear and disappear.   </TransitionRoot> </template>  <script setup>   import { ref } from 'vue'   import { TransitionRoot } from '@headlessui/vue'    const isShowing = ref(true) </script>`

[](#animating-transitions)
--------------------------

By default, a `TransitionRoot` will enter and leave instantly, which is probably not what you're looking for if you're using this component.

To animate your enter/leave transitions, add classes that provide the styling for each phase of the transitions using these props:

*   **enter**: Applied the entire time an element is entering. Usually you define your duration and what properties you want to transition here, for example `transition-opacity duration-75`.
*   **enter-from**: The starting point to enter from, for example `opacity-0` if something should fade in.
*   **enter-to**: The ending point to enter to, for example `opacity-100` after fading in.
*   **leave**: Applied the entire time an element is leaving. Usually you define your duration and what properties you want to transition here, for example `transition-opacity duration-75`.
*   **leave-from**: The starting point to leave from, for example `opacity-100` if something should fade out.
*   **leave-to**: The ending point to leave to, for example `opacity-0` after fading out.

Here's an example:

`<template>   <button @click="isShowing = !isShowing">Toggle</button>   <TransitionRoot     :show="isShowing"`

    `enter="transition-opacity duration-75"`

    `enter-from="opacity-0"`

    `enter-to="opacity-100"`

    `leave="transition-opacity duration-150"`

    `leave-from="opacity-100"`

    `leave-to="opacity-0"`

  `>     I will appear and disappear.   </TransitionRoot> </template>  <script setup>   import { ref } from 'vue'   import { TransitionRoot } from '@headlessui/vue'    const isShowing = ref(true) </script>`

In this example, the transitioning element will take 75ms to enter (that's the `duration-75` class), and will transition the opacity property during that time (that's `transition-opacity`).

It will start completely transparent before entering (that's `opacity-0` in the `enter-from` phase), and fade in to completely opaque (`opacity-100`) when finished (that's the `enterTo` phase).

When the element is being removed (the `leave` phase), it will transition the opacity property, and spend 150ms doing it (`transition-opacity duration-150`).

It will start as completely opaque (the `opacity-100` in the `leave-from` phase), and finish as completely transparent (the `opacity-0` in the `leave-to` phase).

All of these props are optional, and will default to just an empty string.

[](#co-ordinating-multiple-transitions)
---------------------------------------

Sometimes you need to transition multiple elements with different animations but all based on the same state. For example, say the user clicks a button to open a sidebar that slides over the screen, and you also need to fade-in a background overlay at the same time.

You can do this by wrapping the related elements with a parent `TransitionRoot` component, and wrapping each child that needs its own transition styles with a `TransitionChild` component, which will automatically communicate with the parent `TransitionRoot` and inherit the parent's `show` state.

``<template>   <!-- The `show` prop controls all nested `TransitionChild` components. -->   <TransitionRoot :show="isShowing">     <!-- Background overlay -->     <TransitionChild       enter="transition-opacity ease-linear duration-300"       enter-from="opacity-0"       enter-to="opacity-100"       leave="transition-opacity ease-linear duration-300"       leave-from="opacity-100"       leave-to="opacity-0"     >       <!-- ... -->     </TransitionChild>      <!-- Sliding sidebar -->     <TransitionChild       enter="transition ease-in-out duration-300 transform"       enter-from="-translate-x-full"       enter-to="translate-x-0"       leave="transition ease-in-out duration-300 transform"       leave-from="translate-x-0"       leave-to="-translate-x-full"     >       <!-- ... -->     </TransitionChild>   </TransitionRoot> </template>  <script setup>   import { ref } from 'vue'   import { TransitionRoot, TransitionChild } from '@headlessui/vue'    const isShowing = ref(true) </script>``

The `TransitionChild` component has the exact same API as the `TransitionRoot` component, but with no `show` prop, since the `show` value is controlled by the parent.

Parent `TransitionRoot` components will always automatically wait for all children to finish transitioning before unmounting, so you don't need to manage any of that timing yourself.

[](#transitioning-on-initial-mount)
-----------------------------------

If you want an element to transition the very first time it's rendered, set the `appear` prop to `true`.

This is useful if you want something to transition in on initial page load, or when its parent is conditionally rendered.

`<template>   <TransitionRoot`

    `appear`

    `:show="isShowing"     enter="transition-opacity duration-75"     enter-from="opacity-0"     enter-to="opacity-100"     leave="transition-opacity duration-150"     leave-from="opacity-100"     leave-to="opacity-0"   >     <!-- Your content goes here -->   </TransitionRoot> </template>  <script setup>   import { ref } from 'vue'   import { TransitionRoot } from '@headlessui/vue'    const isShowing = ref(true) </script>`

[](#component-api)
------------------

### [](#transition-root)</content>
</page>

<page>
  <title>Headless UI</title>
  <url>https://headlessui.com/v1/react/menu</url>
  <content>Menus offer an easy way to build custom, accessible dropdown components with robust support for keyboard navigation.

[](#installation)
-----------------

To get started, install Headless UI via npm:

`npm install @headlessui/react`

[](#basic-example)
------------------

Menu Buttons are built using the `Menu`, `Menu.Button`, `Menu.Items`, and `Menu.Item` components.

The `Menu.Button` will automatically open/close the `Menu.Items` when clicked, and when the menu is open, the list of items receives focus and is automatically navigable via the keyboard.

``import { Menu } from '@headlessui/react'  function MyDropdown() {   return (     <Menu>       <Menu.Button>More</Menu.Button>       <Menu.Items>         <Menu.Item>           {({ active }) => (             <a               className={`${active && 'bg-blue-500'}`}               href="/account-settings"             >               Account settings             </a>           )}         </Menu.Item>         <Menu.Item>           {({ active }) => (             <a               className={`${active && 'bg-blue-500'}`}               href="/account-settings"             >               Documentation             </a>           )}         </Menu.Item>         <Menu.Item disabled>           <span className="opacity-75">Invite a friend (coming soon!)</span>         </Menu.Item>       </Menu.Items>     </Menu>   ) }``

[](#styling-different-states)
-----------------------------

Headless UI keeps track of a lot of state about each component, like which listbox option is currently selected, whether a popover is open or closed, or which item in a menu is currently active via the keyboard.

But because the components are headless and completely unstyled out of the box, you can't _see_ this information in your UI until you provide the styles you want for each state yourself.

### [](#using-render-props)

Each component exposes information about its current state via [render props](https://reactjs.org/docs/render-props.html) that you can use to conditionally apply different styles or render different content.

For example, the `Menu.Item` component exposes an `active` state, which tells you if the item is currently focused via the mouse or keyboard.

``import { Fragment } from 'react' import { Menu } from '@headlessui/react'  const links = [   { href: '/account-settings', label: 'Account settings' },   { href: '/support', label: 'Support' },   { href: '/license', label: 'License' },   { href: '/sign-out', label: 'Sign out' }, ]  function MyMenu() {   return (     <Menu>       <Menu.Button>Options</Menu.Button>       <Menu.Items>         {links.map((link) => (           /* Use the `active` state to conditionally style the active item. */           <Menu.Item key={link.href} as={Fragment}>``

            `{({ active }) => (`

              ``<a                 href={link.href}                 className={`${                    active ? 'bg-blue-500 text-white' : 'bg-white text-black'                  }`}               >                 {link.label}               </a>             )}           </Menu.Item>         ))}       </Menu.Items>     </Menu>   ) }``

For the complete render prop API for each component, see the [component API documentation](#component-api).

### [](#using-data-attributes)

Each component also exposes information about its current state via a `data-headlessui-state` attribute that you can use to conditionally apply different styles.

When any of the states in the [render prop API](#component-api) are `true`, they will be listed in this attribute as space-separated strings so you can target them with a [CSS attribute selector](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors) in the form `[attr~=value]`.

For example, here's what the `Menu.Items` component with some child `Menu.Item` components renders when the menu is open and the second item is `active`:

``<!-- Rendered `Menu.Items` --> <ul data-headlessui-state="open">   <li data-headlessui-state="">Account settings</li>   <li data-headlessui-state="active">Support</li>   <li data-headlessui-state="">License</li> </ul>``

If you are using [Tailwind CSS](https://tailwindcss.com/), you can use the [@headlessui/tailwindcss](https://github.com/tailwindlabs/headlessui/tree/main/packages/%40headlessui-tailwindcss) plugin to target this attribute with modifiers like `ui-open:*` and `ui-active:*`:

`import { Menu } from '@headlessui/react'  const links = [   { href: '/account-settings', label: 'Account settings' },   { href: '/support', label: 'Support' },   { href: '/license', label: 'License' },   { href: '/sign-out', label: 'Sign out' }, ]  function MyMenu() {   return (     <Menu>       <Menu.Button>Options</Menu.Button>       <Menu.Items>         {links.map((link) => (           <Menu.Item             as="a"             key={link.href}             href={link.href}`

            `className="ui-active:bg-blue-500 ui-active:text-white ui-not-active:bg-white ui-not-active:text-black"`

          `>             {link.label}           </Menu.Item>         ))}       </Menu.Items>     </Menu>   ) }`

By default, your `Menu.Items` instance will be shown/hidden automatically based on the internal `open` state tracked within the `Menu` component itself.

``import { Menu } from '@headlessui/react'  function MyDropdown() {   return (     <Menu>       <Menu.Button>More</Menu.Button>        {/*         By default, the `Menu.Items` will automatically show/hide         when the `Menu.Button` is pressed.       */}       <Menu.Items>         <Menu.Item>{/* ... */}</Menu.Item>         {/* ... */}       </Menu.Items>     </Menu>   ) }``

If you'd rather handle this yourself (perhaps because you need to add an extra wrapper element for one reason or another), you can add a `static` prop to the `Menu.Items` instance to tell it to always render, and inspect the `open` slot prop provided by the `Menu` to control which element is shown/hidden yourself.

`import { Menu } from '@headlessui/react'  function MyDropdown() {   return (     <Menu>`

      `{({ open }) => (`

        ``<>           <Menu.Button>More</Menu.Button>            {open && (              <div>               {/*                 Using the `static` prop, the `Menu.Items` are always                 rendered and the `open` state is ignored.               */}                <Menu.Items static>                  <Menu.Item>{/* ... */}</Menu.Item>                 {/* ... */}               </Menu.Items>             </div>           )}         </>       )}     </Menu>   ) }``

The menu will already close by default, however it can happen that 3rd party `Link` components use `event.preventDefault()`, which prevents the default behaviour and therefore won't close the menu.

The `Menu` and `Menu.Item` expose a `close()` render prop which you can use to imperatively close the menu:

`import { Menu } from '@headlessui/react' import { MyCustomLink } from './MyCustomLink'  function MyMenu() {   return (     <Menu>       <Menu.Button>Terms</Menu.Button>       <Menu.Items>         <Menu.Item>`

          `{({ close }) => (`

            `<MyCustomLink href="/" onClick={close}>`

              `Read and accept             </MyCustomLink>           )}         </Menu.Item>       </Menu.Items>     </Menu>   ) }`

[](#disabling-an-item)
----------------------

Use the `disabled` prop to disable a `Menu.Item`. This will make it unselectable via keyboard navigation, and it will be skipped when pressing the up/down arrows.

`import { Menu } from '@headlessui/react'  function MyDropdown() {   return (     <Menu>       <Menu.Button>More</Menu.Button>       <Menu.Items>         {/* ... */}         {/* This item will be skipped by keyboard navigation. */}`

        `<Menu.Item disabled>`

          `<span className="opacity-75">Invite a friend (coming soon!)</span>         </Menu.Item>         {/* ... */}       </Menu.Items>     </Menu>   ) }`

[](#transitions)
----------------

To animate the opening/closing of the menu panel, use the provided `Transition` component. All you need to do is wrap the `Menu.Items` in a `<Transition>`, and the transition will be applied automatically.

``import { Menu, Transition } from '@headlessui/react'  function MyDropdown() {   return (     <Menu>       <Menu.Button>More</Menu.Button>       {/* Use the `Transition` component. */}``

      `<Transition`

        `enter="transition duration-100 ease-out"`

        `enterFrom="transform scale-95 opacity-0"`

        `enterTo="transform scale-100 opacity-100"`

        `leave="transition duration-75 ease-out"`

        `leaveFrom="transform scale-100 opacity-100"`

        `leaveTo="transform scale-95 opacity-0"`

      `>`

        `<Menu.Items>           <Menu.Item>{/* ... */}</Menu.Item>           {/* ... */}         </Menu.Items>        </Transition>      </Menu>   ) }`

By default our built-in `Transition` component automatically communicates with the `Menu` components to handle the open/closed states. However, if you require more control over this behavior, you can explicitly control it:

`import { Menu, Transition } from '@headlessui/react'  function MyDropdown() {   return (     <Menu>`

      `{({ open }) => (`

        `<>`

          ``<Menu.Button>More</Menu.Button>           {/* Use the `Transition` component. */}           <Transition                show={open}              enter="transition duration-100 ease-out"             enterFrom="transform scale-95 opacity-0"             enterTo="transform scale-100 opacity-100"             leave="transition duration-75 ease-out"             leaveFrom="transform scale-100 opacity-100"             leaveTo="transform scale-95 opacity-0"           >             {/* Mark this component as `static` */}              <Menu.Items static>                <Menu.Item>{/* ... */}</Menu.Item>               {/* ... */}             </Menu.Items>           </Transition>          </>          )}      </Menu>   ) }``

Because they're renderless, Headless UI components also compose well with other animation libraries in the React ecosystem like [Framer Motion](https://www.framer.com/motion/) and [React Spring](https://www.react-spring.io/).

[](#rendering-additional-content)
---------------------------------

The accessibility semantics of `role="menu"` are fairly strict and any children of a `Menu` that are not `Menu.Item` components will be automatically hidden from assistive technology to make sure the menu works the way screen reader users expect.

For this reason, rendering any children other than `Menu.Item` components is discouraged as that content will be inaccessible to people using assistive technology.

If you want to build a dropdown with more flexible content, consider using [Popover](https://headlessui.com/v1/react/popover) instead.

[](#rendering-as-different-elements)
------------------------------------

By default, the `Menu` and its subcomponents each render a default element that is sensible for that component.

For example, `Menu.Button` renders a `button` by default, and `Menu.Items` renders a `div`. By contrast, `Menu` and `Menu.Item` _do not render an element_, and instead render their children directly by default.

Use the `as` prop to render a component as a different element or as your own custom component, making sure your custom components [forward refs](https://react.dev/reference/react/forwardRef) so that Headless UI can wire things up correctly.

`import { forwardRef } from 'react' import { Menu } from '@headlessui/react'`

`​`

`let MyCustomButton = forwardRef(function (props, ref) {`

  `return <button className="..." ref={ref} {...props} />`

``})  function MyDropdown() {   return (        <Menu>        <Menu.Button as={MyCustomButton}>More</Menu.Button>        <Menu.Items as="section">         <Menu.Item>           {({ active }) => (             <a               className={`${active && 'bg-blue-500'}`}               href="/account-settings"             >               Account settings             </a>           )}         </Menu.Item>         {/* ... */}       </Menu.Items>     </Menu>   ) }``

To tell an element to render its children directly with no wrapper element, use `as={React.Fragment}`.

``import { Menu } from '@headlessui/react'  function MyDropdown() {   return (     <Menu>       {/* Render no wrapper, instead pass in a `button` manually. */}``

      `<Menu.Button as={React.Fragment}>`

        ``<button>More</button>       </Menu.Button>       <Menu.Items>         <Menu.Item>           {({ active }) => (             <a               className={`${active && 'bg-blue-500'}`}               href="/account-settings"             >               Account settings             </a>           )}         </Menu.Item>         {/* ... */}       </Menu.Items>     </Menu>   ) }``

This is important if you are using an interactive element like an `<a>` tag inside the `Menu.Item`. If the `Menu.Item` had an `as="div"`, then the props provided by Headless UI would be forwarded to the `div` instead of the `a`, which means that you can't go to the URL provided by the `<a>` tag anymore via your keyboard.

[](#integrating-with-next-js)
-----------------------------

Prior to Next.js v13, the `Link` component did not forward unknown props to the underlying `a` element, preventing the menu from closing on click when used inside a `Menu.Item`.

If you're using Next.js v12 or older, you can work around this issue by creating your own component that wraps `Link` and forwards unknown props to the child `a` element:

`import { forwardRef } from 'react'`

`import Link from 'next/link'`

`import { Menu } from '@headlessui/react'  const MyLink = forwardRef((props, ref) => {      let { href, children, ...rest } = props      return (        <Link href={href}>        <a ref={ref} {...rest}>          {children}        </a>      </Link>      )  })  function Example() {   return (     <Menu>       <Menu.Button>More</Menu.Button>       <Menu.Items>         <Menu.Item>            <MyLink href="/profile">Profile</MyLink>          </Menu.Item>       </Menu.Items>     </Menu>   ) }`

This will ensure that all of the event listeners Headless UI needs to add to the `a` element are properly applied.

This behavior was changed in Next.js v13 making this workaround no longer necessary.

[](#accessibility-notes)
------------------------

### [](#focus-management)

Clicking the `Menu.Button` toggles the menu and focuses the `Menu.Items` component. Focus is trapped within the open menu until Escape is pressed or the user clicks outside the menu. Closing the menu returns focus to the `Menu.Button`.

### [](#mouse-interaction)

Clicking a `Menu.Button` toggles the menu. Clicking anywhere outside of an open menu will close that menu.

### [](#keyboard-interaction)

### [](#other)

All relevant ARIA attributes are automatically managed.

For a full reference on all accessibility features implemented in `Menu`, see [the ARIA spec on Menu Buttons](https://www.w3.org/TR/wai-aria-practices-1.2/#menubutton).

Menus are best for UI elements that resemble things like the menus you'd find in the title bar of most operating systems. They have specific accessibility semantics, and their content should be restricted to a list of links or buttons. Focus is trapped in an open menu, so you cannot Tab through the content or away from the menu. Instead, the arrow keys navigate through a Menu's items.

Here's when you might use other similar components from Headless UI:

*   **`<Popover />`**. Popovers are general-purpose floating menus. They appear near the button that triggers them, and you can put arbitrary markup in them like images or non-clickable content. The Tab key navigates the contents of a Popover like it would any other normal markup. They're great for building header nav items with expandable content and flyout panels.
    
*   **`<Disclosure />`**. Disclosures are useful for elements that expand to reveal additional information, like a toggleable FAQ section. They are typically rendered inline and reflow the document when they're shown or hidden.
    
*   **`<Dialog />`**. Dialogs are meant to grab the user's full attention. They typically render a floating panel in the center of the screen, and use a backdrop to dim the rest of the application's contents. They also capture focus and prevent tabbing away from the Dialog's contents until the Dialog is dismissed.
    

[](#component-api)
------------------</content>
</page>

<page>
  <title>Headless UI</title>
  <url>https://headlessui.com/v1/react/listbox</url>
  <content>Listboxes are a great foundation for building custom, accessible select menus for your app, complete with robust support for keyboard navigation.

[](#installation)
-----------------

To get started, install Headless UI via npm:

`npm install @headlessui/react`

[](#basic-example)
------------------

Listboxes are built using the `Listbox`, `Listbox.Button`, `Listbox.Options`, `Listbox.Option` and `Listbox.Label` components.

The `Listbox.Button` will automatically open/close the `Listbox.Options` when clicked, and when the menu is open, the list of items receives focus and is automatically navigable via the keyboard.

`import { useState } from 'react' import { Listbox } from '@headlessui/react'  const people = [   { id: 1, name: 'Durward Reynolds', unavailable: false },   { id: 2, name: 'Kenton Towne', unavailable: false },   { id: 3, name: 'Therese Wunsch', unavailable: false },   { id: 4, name: 'Benedict Kessler', unavailable: true },   { id: 5, name: 'Katelyn Rohan', unavailable: false }, ]  function MyListbox() {   const [selectedPerson, setSelectedPerson] = useState(people[0])    return (     <Listbox value={selectedPerson} onChange={setSelectedPerson}>       <Listbox.Button>{selectedPerson.name}</Listbox.Button>       <Listbox.Options>         {people.map((person) => (           <Listbox.Option             key={person.id}             value={person}             disabled={person.unavailable}           >             {person.name}           </Listbox.Option>         ))}       </Listbox.Options>     </Listbox>   ) }`

[](#styling-different-states)
-----------------------------

Headless UI keeps track of a lot of state about each component, like which listbox option is currently selected, whether a popover is open or closed, or which item in a menu is currently active via the keyboard.

But because the components are headless and completely unstyled out of the box, you can't _see_ this information in your UI until you provide the styles you want for each state yourself.

### [](#using-render-props)

Each component exposes information about its current state via [render props](https://reactjs.org/docs/render-props.html) that you can use to conditionally apply different styles or render different content.

For example, the `Listbox.Option` component exposes an `active` state, which tells you if the option is currently focused via the mouse or keyboard, and a `selected` state, which tells you if that option matches the current `value` of the `Listbox`.

``import { useState, Fragment } from 'react' import { Listbox } from '@headlessui/react' import { CheckIcon } from '@heroicons/react/20/solid'  const people = [   { id: 1, name: 'Durward Reynolds' },   { id: 2, name: 'Kenton Towne' },   { id: 3, name: 'Therese Wunsch' },   { id: 4, name: 'Benedict Kessler' },   { id: 5, name: 'Katelyn Rohan' }, ]  function MyListbox() {   const [selectedPerson, setSelectedPerson] = useState(people[0])    return (     <Listbox value={selectedPerson} onChange={setSelectedPerson}>       <Listbox.Button>{selectedPerson.name}</Listbox.Button>       <Listbox.Options>         {people.map((person) => (           /* Use the `active` state to conditionally style the active option. */           /* Use the `selected` state to conditionally style the selected option. */           <Listbox.Option key={person.id} value={person} as={Fragment}>``

            `{({ active, selected }) => (`

              ``<li                 className={`${                    active ? 'bg-blue-500 text-white' : 'bg-white text-black'                  }`}               >                  {selected && <CheckIcon />}                  {person.name}               </li>             )}           </Listbox.Option>         ))}       </Listbox.Options>     </Listbox>   ) }``

For the complete render prop API for each component, see the [component API documentation](#component-api).

### [](#using-data-attributes)

Each component also exposes information about its current state via a `data-headlessui-state` attribute that you can use to conditionally apply different styles.

When any of the states in the [render prop API](#component-api) are `true`, they will be listed in this attribute as space-separated strings so you can target them with a [CSS attribute selector](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors) in the form `[attr~=value]`.

For example, here's what the `Listbox.Options` component with some child `Listbox.Option` components renders when the listbox is open and the second option is both `selected` and `active`:

``<!-- Rendered `Listbox.Options` --> <ul data-headlessui-state="open">   <li data-headlessui-state="">Wade Cooper</li>   <li data-headlessui-state="active selected">Arlene Mccoy</li>   <li data-headlessui-state="">Devon Webb</li> </ul>``

If you are using [Tailwind CSS](https://tailwindcss.com/), you can use the [@headlessui/tailwindcss](https://github.com/tailwindlabs/headlessui/tree/main/packages/%40headlessui-tailwindcss) plugin to target this attribute with modifiers like `ui-open:*` and `ui-active:*`:

`import { useState } from 'react' import { Listbox } from '@headlessui/react' import { CheckIcon } from '@heroicons/react/20/solid'  const people = [   { id: 1, name: 'Durward Reynolds' },   { id: 2, name: 'Kenton Towne' },   { id: 3, name: 'Therese Wunsch' },   { id: 4, name: 'Benedict Kessler' },   { id: 5, name: 'Katelyn Rohan' }, ]  function MyListbox() {   const [selectedPerson, setSelectedPerson] = useState(people[0])    return (     <Listbox value={selectedPerson} onChange={setSelectedPerson}>       <Listbox.Button>{selectedPerson.name}</Listbox.Button>       <Listbox.Options>         {people.map((person) => (           <Listbox.Option             key={person.id}             value={person}`

            `className="ui-active:bg-blue-500 ui-active:text-white ui-not-active:bg-white ui-not-active:text-black"`

          `>              <CheckIcon className="hidden ui-selected:block" />              {person.name}           </Listbox.Option>         ))}       </Listbox.Options>     </Listbox>   ) }`

[](#binding-objects-as-values)
------------------------------

Unlike native HTML form controls which only allow you to provide strings as values, Headless UI supports binding complex objects as well.

`import { useState } from 'react' import { Listbox } from '@headlessui/react'`

`const people = [`

  `{ id: 1, name: 'Durward Reynolds', unavailable: false },`

  `{ id: 2, name: 'Kenton Towne', unavailable: false },`

  `{ id: 3, name: 'Therese Wunsch', unavailable: false },`

  `{ id: 4, name: 'Benedict Kessler', unavailable: true },`

  `{ id: 5, name: 'Katelyn Rohan', unavailable: false },`

`]`

`function MyListbox() {   const [selectedPerson, setSelectedPerson] = useState(people[0])    return (        <Listbox value={selectedPerson} onChange={setSelectedPerson}>        <Listbox.Button>{selectedPerson.name}</Listbox.Button>       <Listbox.Options>         {people.map((person) => (           <Listbox.Option             key={person.id}                value={person}              disabled={person.unavailable}           >             {person.name}           </Listbox.Option>         ))}       </Listbox.Options>     </Listbox>   ) }`

When binding objects as values, it's important to make sure that you use the _same instance_ of the object as both the `value` of the `Listbox` as well as the corresponding `Listbox.Option`, otherwise they will fail to be equal and cause the listbox to behave incorrectly.

To make it easier to work with different instances of the same object, you can use the `by` prop to compare the objects by a particular field instead of comparing object identity:

`import { Listbox } from '@headlessui/react'  const departments = [   { id: 1, name: 'Marketing', contact: 'Durward Reynolds' },   { id: 2, name: 'HR', contact: 'Kenton Towne' },   { id: 3, name: 'Sales', contact: 'Therese Wunsch' },   { id: 4, name: 'Finance', contact: 'Benedict Kessler' },   { id: 5, name: 'Customer service', contact: 'Katelyn Rohan' }, ]`

`function DepartmentPicker({ selectedDepartment, onChange }) {`

  `return (        <Listbox value={selectedDepartment} by="id" onChange={onChange}>        <Listbox.Button>{selectedDepartment.name}</Listbox.Button>       <Listbox.Options>         {departments.map((department) => (           <Listbox.Option key={department.id} value={department}>             {department.name}           </Listbox.Option>         ))}       </Listbox.Options>     </Listbox>   ) }`

You can also pass your own comparison function to the `by` prop if you'd like complete control over how objects are compared:

`import { Listbox } from '@headlessui/react'  const departments = [   { id: 1, name: 'Marketing', contact: 'Durward Reynolds' },   { id: 2, name: 'HR', contact: 'Kenton Towne' },   { id: 3, name: 'Sales', contact: 'Therese Wunsch' },   { id: 4, name: 'Finance', contact: 'Benedict Kessler' },   { id: 5, name: 'Customer service', contact: 'Katelyn Rohan' }, ]`

`function compareDepartments(a, b) {`

  `return a.name.toLowerCase() === b.name.toLowerCase()`

`}`

`function DepartmentPicker({ selectedDepartment, onChange }) {   return (     <Listbox       value={selectedDepartment}          by={compareDepartments}        onChange={onChange}     >       <Listbox.Button>{selectedDepartment.name}</Listbox.Button>       <Listbox.Options>         {departments.map((department) => (           <Listbox.Option key={department.id} value={department}>             {department.name}           </Listbox.Option>         ))}       </Listbox.Options>     </Listbox>   ) }`

[](#selecting-multiple-values)
------------------------------

To allow selecting multiple values in your listbox, use the `multiple` prop and pass an array to `value` instead of a single option.

`import { useState } from 'react' import { Listbox } from '@headlessui/react'  const people = [   { id: 1, name: 'Durward Reynolds' },   { id: 2, name: 'Kenton Towne' },   { id: 3, name: 'Therese Wunsch' },   { id: 4, name: 'Benedict Kessler' },   { id: 5, name: 'Katelyn Rohan' }, ]  function MyListbox() {`

  `const [selectedPeople, setSelectedPeople] = useState([people[0], people[1]])`

  `return (        <Listbox value={selectedPeople} onChange={setSelectedPeople} multiple>        <Listbox.Button>         {selectedPeople.map((person) => person.name).join(', ')}       </Listbox.Button>       <Listbox.Options>         {people.map((person) => (           <Listbox.Option key={person.id} value={person}>             {person.name}           </Listbox.Option>         ))}       </Listbox.Options>     </Listbox>   ) }`

This will keep the listbox open when you are selecting options, and choosing an option will toggle it in place.

Your `onChange` handler will be called with an array containing all selected options any time an option is added or removed.

[](#using-a-custom-label)
-------------------------

By default the `Listbox` will use the button contents as the label for screenreaders. If you'd like more control over what is announced to assistive technologies, use the `Listbox.Label` component.

`import { useState } from 'react' import { Listbox } from '@headlessui/react'  const people = [   { id: 1, name: 'Durward Reynolds' },   { id: 2, name: 'Kenton Towne' },   { id: 3, name: 'Therese Wunsch' },   { id: 4, name: 'Benedict Kessler' },   { id: 5, name: 'Katelyn Rohan' }, ]  function MyListbox() {   const [selectedPerson, setSelectedPerson] = useState(people[0])    return (     <Listbox value={selectedPerson} onChange={setSelectedPerson}>`

      `<Listbox.Label>Assignee:</Listbox.Label>`

      `<Listbox.Button>{selectedPerson.name}</Listbox.Button>       <Listbox.Options>         {people.map((person) => (           <Listbox.Option key={person.id} value={person}>             {person.name}           </Listbox.Option>         ))}       </Listbox.Options>     </Listbox>   ) }`

[](#using-with-html-forms)
--------------------------

If you add the `name` prop to your listbox, hidden `input` elements will be rendered and kept in sync with your selected value.

`import { useState } from 'react' import { Listbox } from '@headlessui/react'  const people = [   { id: 1, name: 'Durward Reynolds' },   { id: 2, name: 'Kenton Towne' },   { id: 3, name: 'Therese Wunsch' },   { id: 4, name: 'Benedict Kessler' },   { id: 5, name: 'Katelyn Rohan' }, ]  function Example() {   const [selectedPerson, setSelectedPerson] = useState(people[0])    return (     <form action="/projects/1/assignee" method="post">       <Listbox         value={selectedPerson}         onChange={setSelectedPerson}`

        `name="assignee"`

      `>         <Listbox.Button>{selectedPerson.name}</Listbox.Button>         <Listbox.Options>           {people.map((person) => (             <Listbox.Option key={person.id} value={person}>               {person.name}             </Listbox.Option>           ))}         </Listbox.Options>       </Listbox>       <button>Submit</button>     </form>   ) }`

This lets you use a listbox inside a native HTML `<form>` and make traditional form submissions as if your listbox was a native HTML form control.

Basic values like strings will be rendered as a single hidden input containing that value, but complex values like objects will be encoded into multiple inputs using a square bracket notation for the names:

`<input type="hidden" name="assignee[id]" value="1" /> <input type="hidden" name="assignee[name]" value="Durward Reynolds" />`

[](#using-as-an-uncontrolled-component)
---------------------------------------

If you provide a `defaultValue` prop to the `Listbox` instead of a `value`, Headless UI will track its state internally for you, allowing you to use it as an [uncontrolled component](https://reactjs.org/docs/uncontrolled-components.html).

You can access the currently selected option via the `value` render prop on the `Listbox` and `Listbox.Button` components.

`import { Listbox } from '@headlessui/react'  const people = [   { id: 1, name: 'Durward Reynolds' },   { id: 2, name: 'Kenton Towne' },   { id: 3, name: 'Therese Wunsch' },   { id: 4, name: 'Benedict Kessler' },   { id: 5, name: 'Katelyn Rohan' }, ]  function Example() {   return (     <form action="/projects/1/assignee" method="post">`

      `<Listbox name="assignee" defaultValue={people[0]}>`

        `<Listbox.Button>{({ value }) => value.name}</Listbox.Button>`

        `<Listbox.Options>           {people.map((person) => (             <Listbox.Option key={person.id} value={person}>               {person.name}             </Listbox.Option>           ))}         </Listbox.Options>       </Listbox>       <button>Submit</button>     </form>   ) }`

This can simplify your code when using the listbox [with HTML forms](#using-with-html-forms) or with form APIs that collect their state using [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData) instead of tracking it using React state.

Any `onChange` prop you provide will still be called when the component's value changes in case you need to run any side effects, but you won't need to use it to track the component's state yourself.

[](#showing-hiding-the-listbox)
-------------------------------

By default, your `Listbox.Options` instance will be shown/hidden automatically based on the internal `open` state tracked within the `Listbox` component itself.

``import { useState } from 'react' import { Listbox } from '@headlessui/react'  const people = [   { id: 1, name: 'Durward Reynolds' },   { id: 2, name: 'Kenton Towne' },   { id: 3, name: 'Therese Wunsch' },   { id: 4, name: 'Benedict Kessler' },   { id: 5, name: 'Katelyn Rohan' }, ]  function MyListbox() {   const [selectedPerson, setSelectedPerson] = useState(people[0])    return (     <Listbox value={selectedPerson} onChange={setSelectedPerson}>       <Listbox.Button>{selectedPerson.name}</Listbox.Button>        {/*         By default, the `Listbox.Options` will automatically show/hide         when the `Listbox.Button` is pressed.       */}       <Listbox.Options>         {people.map((person) => (           <Listbox.Option key={person.id} value={person}>             {person.name}           </Listbox.Option>         ))}       </Listbox.Options>     </Listbox>   ) }``

If you'd rather handle this yourself (perhaps because you need to add an extra wrapper element for one reason or another), you can add a `static` prop to the `Listbox.Options` instance to tell it to always render, and inspect the `open` render prop provided by `Listbox` to control which element is shown/hidden yourself.

`import { useState } from 'react' import { Listbox } from '@headlessui/react'  const people = [   { id: 1, name: 'Durward Reynolds' },   { id: 2, name: 'Kenton Towne' },   { id: 3, name: 'Therese Wunsch' },   { id: 4, name: 'Benedict Kessler' },   { id: 5, name: 'Katelyn Rohan' }, ]  function MyListbox() {   const [selectedPerson, setSelectedPerson] = useState(people[0])    return (     <Listbox value={selectedPerson} onChange={setSelectedPerson}>       {({ open }) => (         <>           <Listbox.Button>{selectedPerson.name}</Listbox.Button>`

          `{open && (`

            ``<div>               {/*                 Using the `static` prop, the `Listbox.Options` are always                 rendered and the `open` state is ignored.               */}                <Listbox.Options static>                  {people.map((person) => (                   <Listbox.Option key={person.id} value={person}>                     {person.name}                   </Listbox.Option>                 ))}               </Listbox.Options>             </div>           )}         </>       )}     </Listbox>   ) }``

[](#disabling-an-option)
------------------------

Use the `disabled` prop to disable a `Listbox.Option`. This will make it unselectable via mouse and keyboard, and it will be skipped when pressing the up/down arrows.

`import { useState } from 'react' import { Listbox } from '@headlessui/react'  const people = [   { id: 1, name: 'Durward Reynolds', unavailable: false },   { id: 2, name: 'Kenton Towne', unavailable: false },   { id: 3, name: 'Therese Wunsch', unavailable: false },   { id: 4, name: 'Benedict Kessler', unavailable: true },   { id: 5, name: 'Katelyn Rohan', unavailable: false }, ]  function MyListbox() {   const [selectedPerson, setSelectedPerson] = useState(people[0])    return (     <Listbox value={selectedPerson} onChange={setSelectedPerson}>       <Listbox.Button>{selectedPerson.name}</Listbox.Button>       <Listbox.Options>         {people.map((person) => (           /* Disabled options will be skipped by keyboard navigation. */           <Listbox.Option             key={person.id}             value={person}`

            `disabled={person.unavailable}`

          `>             <span className={person.unavailable ? 'opacity-75' : ''}>               {person.name}             </span>           </Listbox.Option>         ))}       </Listbox.Options>     </Listbox>   ) }`

[](#transitions)
----------------

To animate the opening/closing of the listbox panel, use the provided `Transition` component. All you need to do is wrap the `Listbox.Options` in a `<Transition>`, and the transition will be applied automatically.

`import { useState } from 'react' import { Listbox, Transition } from '@headlessui/react'  const people = [   { id: 1, name: 'Durward Reynolds' },   { id: 2, name: 'Kenton Towne' },   { id: 3, name: 'Therese Wunsch' },   { id: 4, name: 'Benedict Kessler' },   { id: 5, name: 'Katelyn Rohan' }, ]  function MyListbox() {   const [selectedPerson, setSelectedPerson] = useState(people[0])    return (     <Listbox value={selectedPerson} onChange={setSelectedPerson}>       <Listbox.Button>{selectedPerson.name}</Listbox.Button>`

      `<Transition`

        `enter="transition duration-100 ease-out"`

        `enterFrom="transform scale-95 opacity-0"`

        `enterTo="transform scale-100 opacity-100"`

        `leave="transition duration-75 ease-out"`

        `leaveFrom="transform scale-100 opacity-100"`

        `leaveTo="transform scale-95 opacity-0"`

      `>`

        `<Listbox.Options>           {people.map((person) => (             <Listbox.Option key={person.id} value={person}>               {person.name}             </Listbox.Option>           ))}         </Listbox.Options>        </Transition>      </Listbox>   ) }`

By default our built-in `Transition` component automatically communicates with the `Listbox` components to handle the open/closed states. However, if you require more control over this behavior, you can explicitly control it:

`import { useState } from 'react' import { Listbox, Transition } from '@headlessui/react'  const people = [   { id: 1, name: 'Durward Reynolds' },   { id: 2, name: 'Kenton Towne' },   { id: 3, name: 'Therese Wunsch' },   { id: 4, name: 'Benedict Kessler' },   { id: 5, name: 'Katelyn Rohan' }, ]  function MyListbox() {   const [selectedPerson, setSelectedPerson] = useState(people[0])    return (     <Listbox value={selectedPerson} onChange={setSelectedPerson}>`

      `{({ open }) => (`

        `<>`

          ``<Listbox.Button>{selectedPerson.name}</Listbox.Button>           {/*             Use the `Transition` + `open` render prop argument to add transitions.           */}           <Transition                show={open}              enter="transition duration-100 ease-out"             enterFrom="transform scale-95 opacity-0"             enterTo="transform scale-100 opacity-100"             leave="transition duration-75 ease-out"             leaveFrom="transform scale-100 opacity-100"             leaveTo="transform scale-95 opacity-0"           >             {/*               Don't forget to add `static` to your `Listbox.Options`!             */}              <Listbox.Options static>                {people.map((person) => (                 <Listbox.Option key={person.id} value={person}>                   {person.name}                 </Listbox.Option>               ))}             </Listbox.Options>           </Transition>          </>          )}      </Listbox>   ) }``

Because they're renderless, Headless UI components also compose well with other animation libraries in the React ecosystem like [Framer Motion](https://www.framer.com/motion/) and [React Spring](https://www.react-spring.io/).

[](#rendering-as-different-elements)
------------------------------------

By default, the `Listbox` and its subcomponents each render a default element that is sensible for that component.

For example, `Listbox.Label` renders a `label` by default, `Listbox.Button` renders a `button`, `Listbox.Options` renders a `ul`, and `Listbox.Option` renders a `li`. By contrast, `Listbox` _does not render an element_, and instead renders its children directly.

Use the `as` prop to render a component as a different element or as your own custom component, making sure your custom components [forward refs](https://react.dev/reference/react/forwardRef) so that Headless UI can wire things up correctly.

`import { forwardRef, useState } from 'react' import { Listbox } from '@headlessui/react'  const people = [   { id: 1, name: 'Durward Reynolds' },   { id: 2, name: 'Kenton Towne' },   { id: 3, name: 'Therese Wunsch' },   { id: 4, name: 'Benedict Kessler' },   { id: 5, name: 'Katelyn Rohan' }, ]`

`let MyCustomButton = forwardRef(function (props, ref) {`

  `return <button className="..." ref={ref} {...props} />`

`})`

`function MyListbox() {   const [selectedPerson, setSelectedPerson] = useState(people[0])    return (        <Listbox as="div" value={selectedPerson} onChange={setSelectedPerson}>        <Listbox.Button as={MyCustomButton}>          {selectedPerson.name}       </Listbox.Button>        <Listbox.Options as="div">          {people.map((person) => (              <Listbox.Option as="span" key={person.id} value={person}>              {person.name}           </Listbox.Option>         ))}       </Listbox.Options>     </Listbox>   ) }`

To tell an element to render its children directly with no wrapper element, use a `Fragment`.

``import { useState, Fragment } from 'react' import { Listbox } from '@headlessui/react'  const people = [   { id: 1, name: 'Durward Reynolds' },   { id: 2, name: 'Kenton Towne' },   { id: 3, name: 'Therese Wunsch' },   { id: 4, name: 'Benedict Kessler' },   { id: 5, name: 'Katelyn Rohan' }, ]  function MyListbox() {   const [selectedPerson, setSelectedPerson] = useState(people[0])    return (     <Listbox value={selectedPerson} onChange={setSelectedPerson}>       {/* Render a `Fragment` instead of a `button` */}``

      `<Listbox.Button as={Fragment}>`

        `<button>{selectedPerson.name}</button>       </Listbox.Button>       <Listbox.Options>         {people.map((person) => (           <Listbox.Option key={person.id} value={person}>             {person.name}           </Listbox.Option>         ))}       </Listbox.Options>     </Listbox>   ) }`

[](#horizontal-options)
-----------------------

If you've styled your `Listbox.Options` to appear horizontally, use the `horizontal` prop on the `Listbox` component to enable navigating the items with the left and right arrow keys instead of up and down, and to update the `aria-orientation` attribute for assistive technologies.

`import { useState, Fragment } from 'react' import { Listbox } from '@headlessui/react'  const people = [   { id: 1, name: 'Durward Reynolds' },   { id: 2, name: 'Kenton Towne' },   { id: 3, name: 'Therese Wunsch' },   { id: 4, name: 'Benedict Kessler' },   { id: 5, name: 'Katelyn Rohan' }, ]  function MyListbox() {   const [selectedPerson, setSelectedPerson] = useState(people[0])    return (`

    `<Listbox value={selectedPerson} onChange={setSelectedPerson} horizontal>`

      `<Listbox.Button>{selectedPerson.name}</Listbox.Button>       <Listbox.Options className="flex flex-row">         {people.map((person) => (           <Listbox.Option key={person.id} value={person}>             {person.name}           </Listbox.Option>         ))}       </Listbox.Options>     </Listbox>   ) }`

[](#accessibility-notes)
------------------------

### [](#focus-management)

When a Listbox is toggled open, the `Listbox.Options` receives focus. Focus is trapped within the list of items until Escape is pressed or the user clicks outside the options. Closing the Listbox returns focus to the `Listbox.Button`.

### [](#mouse-interaction)

Clicking a `Listbox.Button` toggles the options list open and closed. Clicking anywhere outside of the options list will close the listbox.

### [](#keyboard-interaction)

### [](#other)

All relevant ARIA attributes are automatically managed.

[](#component-api)
------------------

### [](#listbox)

The main Listbox component.

### [](#listbox-label)

A label that can be used for more control over the text your Listbox will announce to screenreaders. Its `id` attribute will be automatically generated and linked to the root `Listbox` component via the `aria-labelledby` attribute.

### [](#listbox-options)

The component that directly wraps the list of options in your custom Listbox.

### [](#listbox-option)

Used to wrap each item within your Listbox.</content>
</page>

<page>
  <title>Headless UI</title>
  <url>https://headlessui.com/v1/react/combobox</url>
  <content>Comboboxes are the foundation of accessible autocompletes and command palettes for your app, complete with robust support for keyboard navigation.

[](#installation)
-----------------

To get started, install Headless UI via npm:

`npm install @headlessui/react`

[](#basic-example)
------------------

Comboboxes are built using the `Combobox`, `Combobox.Input`, `Combobox.Button`, `Combobox.Options`, `Combobox.Option` and `Combobox.Label` components.

The `Combobox.Input` will automatically open/close the `Combobox.Options` when searching.

You are completely in charge of how you filter the results, whether it be with a fuzzy search library client-side or by making server-side requests to an API. In this example we will keep the logic simple for demo purposes.

`import { useState } from 'react' import { Combobox } from '@headlessui/react'  const people = [   'Durward Reynolds',   'Kenton Towne',   'Therese Wunsch',   'Benedict Kessler',   'Katelyn Rohan', ]  function MyCombobox() {   const [selectedPerson, setSelectedPerson] = useState(people[0])   const [query, setQuery] = useState('')    const filteredPeople =     query === ''       ? people       : people.filter((person) => {           return person.toLowerCase().includes(query.toLowerCase())         })    return (     <Combobox value={selectedPerson} onChange={setSelectedPerson}>       <Combobox.Input onChange={(event) => setQuery(event.target.value)} />       <Combobox.Options>         {filteredPeople.map((person) => (           <Combobox.Option key={person} value={person}>             {person}           </Combobox.Option>         ))}       </Combobox.Options>     </Combobox>   ) }`

[](#styling-different-states)
-----------------------------

Headless UI keeps track of a lot of state about each component, like which listbox option is currently selected, whether a popover is open or closed, or which item in a menu is currently active via the keyboard.

But because the components are headless and completely unstyled out of the box, you can't _see_ this information in your UI until you provide the styles you want for each state yourself.

### [](#using-render-props)

Each component exposes information about its current state via [render props](https://reactjs.org/docs/render-props.html) that you can use to conditionally apply different styles or render different content.

For example, the `Combobox.Option` component exposes an `active` state, which tells you if the option is currently focused via the mouse or keyboard, and a `selected` state, which tells you if that option matches the current `value` of the `Combobox`.

``import { useState, Fragment } from 'react' import { Combobox } from '@headlessui/react' import { CheckIcon } from '@heroicons/react/20/solid'  const people = [   { id: 1, name: 'Durward Reynolds' },   { id: 2, name: 'Kenton Towne' },   { id: 3, name: 'Therese Wunsch' },   { id: 4, name: 'Benedict Kessler' },   { id: 5, name: 'Katelyn Rohan' }, ]  function MyCombobox() {   const [selectedPerson, setSelectedPerson] = useState(people[0])   const [query, setQuery] = useState('')    const filteredPeople =     query === ''       ? people       : people.filter((person) => {           return person.name.toLowerCase().includes(query.toLowerCase())         })    return (     <Combobox value={selectedPerson} onChange={setSelectedPerson}>       <Combobox.Input         onChange={(event) => setQuery(event.target.value)}         displayValue={(person) => person.name}       />       <Combobox.Options>         {filteredPeople.map((person) => (           /* Use the `active` state to conditionally style the active option. */           /* Use the `selected` state to conditionally style the selected option. */           <Combobox.Option key={person.id} value={person} as={Fragment}>``

            `{({ active, selected }) => (`

              ``<li                 className={`${                    active ? 'bg-blue-500 text-white' : 'bg-white text-black'                  }`}               >                  {selected && <CheckIcon />}                  {person.name}               </li>             )}           </Combobox.Option>         ))}       </Combobox.Options>     </Combobox>   ) }``

For the complete render prop API for each component, see the [component API documentation](#component-api).

### [](#using-data-attributes)

Each component also exposes information about its current state via a `data-headlessui-state` attribute that you can use to conditionally apply different styles.

When any of the states in the [render prop API](#component-api) are `true`, they will be listed in this attribute as space-separated strings so you can target them with a [CSS attribute selector](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors) in the form `[attr~=value]`.

For example, here's what the `Combobox.Options` component with some child `Combobox.Option` components renders when the combobox is open and the second option is both `selected` and `active`:

``<!-- Rendered `Combobox.Options` --> <ul data-headlessui-state="open">   <li data-headlessui-state="">Wade Cooper</li>   <li data-headlessui-state="active selected">Arlene Mccoy</li>   <li data-headlessui-state="">Devon Webb</li> </ul>``

If you are using [Tailwind CSS](https://tailwindcss.com/), you can use the [@headlessui/tailwindcss](https://github.com/tailwindlabs/headlessui/tree/main/packages/%40headlessui-tailwindcss) plugin to target this attribute with modifiers like `ui-open:*` and `ui-active:*`:

`import { useState, Fragment } from 'react' import { Combobox } from '@headlessui/react' import { CheckIcon } from '@heroicons/react/20/solid'  const people = [   { id: 1, name: 'Durward Reynolds' },   { id: 2, name: 'Kenton Towne' },   { id: 3, name: 'Therese Wunsch' },   { id: 4, name: 'Benedict Kessler' },   { id: 5, name: 'Katelyn Rohan' }, ]  function MyCombobox() {   const [selectedPerson, setSelectedPerson] = useState(people[0])   const [query, setQuery] = useState('')    const filteredPeople =     query === ''       ? people       : people.filter((person) => {           return person.name.toLowerCase().includes(query.toLowerCase())         })    return (     <Combobox value={selectedPerson} onChange={setSelectedPerson}>       <Combobox.Input         onChange={(event) => setQuery(event.target.value)}         displayValue={(person) => person.name}       />       <Combobox.Options>         {filteredPeople.map((person) => (           <Combobox.Option             key={person.id}             value={person}`

            `className="ui-active:bg-blue-500 ui-active:text-white ui-not-active:bg-white ui-not-active:text-black"`

          `>              <CheckIcon className="hidden ui-selected:block" />              {person.name}           </Combobox.Option>         ))}       </Combobox.Options>     </Combobox>   ) }`

[](#binding-objects-as-values)
------------------------------

Unlike native HTML form controls which only allow you to provide strings as values, Headless UI supports binding complex objects as well.

When binding objects, make sure to set the `displayValue` on your `Combobox.Input` so that a string representation of the selected option can be rendered in the input:

`import { useState } from 'react' import { Combobox } from '@headlessui/react'`

`const people = [`

  `{ id: 1, name: 'Durward Reynolds', unavailable: false },`

  `{ id: 2, name: 'Kenton Towne', unavailable: false },`

  `{ id: 3, name: 'Therese Wunsch', unavailable: false },`

  `{ id: 4, name: 'Benedict Kessler', unavailable: true },`

  `{ id: 5, name: 'Katelyn Rohan', unavailable: false },`

`]`

`function MyCombobox() {   const [selectedPerson, setSelectedPerson] = useState(people[0])   const [query, setQuery] = useState('')    const filteredPeople =     query === ''       ? people       : people.filter((person) => {           return person.name.toLowerCase().includes(query.toLowerCase())         })    return (        <Combobox value={selectedPerson} onChange={setSelectedPerson}>        <Combobox.Input         onChange={(event) => setQuery(event.target.value)}            displayValue={(person) => person.name}        />       <Combobox.Options>         {filteredPeople.map((person) => (           <Combobox.Option             key={person.id}                value={person}              disabled={person.unavailable}           >             {person.name}           </Combobox.Option>         ))}       </Combobox.Options>     </Combobox>   ) }`

When binding objects as values, it's important to make sure that you use the _same instance_ of the object as both the `value` of the `Combobox` as well as the corresponding `Combobox.Option`, otherwise they will fail to be equal and cause the combobox to behave incorrectly.

To make it easier to work with different instances of the same object, you can use the `by` prop to compare the objects by a particular field instead of comparing object identity:

`import { useState } from 'react' import { Combobox } from '@headlessui/react'  const departments = [   { id: 1, name: 'Marketing', contact: 'Durward Reynolds' },   { id: 2, name: 'HR', contact: 'Kenton Towne' },   { id: 3, name: 'Sales', contact: 'Therese Wunsch' },   { id: 4, name: 'Finance', contact: 'Benedict Kessler' },   { id: 5, name: 'Customer service', contact: 'Katelyn Rohan' }, ]`

`function DepartmentPicker({ selectedDepartment, onChange }) {`

  `const [query, setQuery] = useState('')    const filteredDepartments =     query === ''       ? departments       : departments.filter((department) => {           return department.name.toLowerCase().includes(query.toLowerCase())         })    return (        <Combobox value={selectedDepartment} by="id" onChange={onChange}>        <Combobox.Input         onChange={(event) => setQuery(event.target.value)}         displayValue={(department) => department.name}       />       <Combobox.Options>         {filteredDepartments.map((department) => (           <Combobox.Option key={department.id} value={department}>             {department.name}           </Combobox.Option>         ))}       </Combobox.Options>     </Combobox>   ) }`

You can also pass your own comparison function to the `by` prop if you'd like complete control over how objects are compared:

`import { useState } from 'react' import { Combobox } from '@headlessui/react'  const departments = [   { id: 1, name: 'Marketing', contact: 'Durward Reynolds' },   { id: 2, name: 'HR', contact: 'Kenton Towne' },   { id: 3, name: 'Sales', contact: 'Therese Wunsch' },   { id: 4, name: 'Finance', contact: 'Benedict Kessler' },   { id: 5, name: 'Customer service', contact: 'Katelyn Rohan' }, ]`

`function compareDepartments(a, b) {`

  `return a.name.toLowerCase() === b.name.toLowerCase()`

`}`

`function DepartmentPicker({ selectedDepartment, onChange }) {   const [query, setQuery] = useState('')    const filteredDepartments =     query === ''       ? departments       : departments.filter((department) => {           return department.name.toLowerCase().includes(query.toLowerCase())         })    return (     <Combobox       value={selectedDepartment}          by={compareDepartments}        onChange={onChange}     >       <Combobox.Input         onChange={(event) => setQuery(event.target.value)}         displayValue={(department) => department.name}       />       <Combobox.Options>         {filteredDepartments.map((department) => (           <Combobox.Option key={department.id} value={department}>             {department.name}           </Combobox.Option>         ))}       </Combobox.Options>     </Combobox>   ) }`

[](#selecting-multiple-values)
------------------------------

To allow selecting multiple values in your combobox, use the `multiple` prop and pass an array to `value` instead of a single option.

`import { useState } from 'react' import { Combobox } from '@headlessui/react'  const people = [   { id: 1, name: 'Durward Reynolds' },   { id: 2, name: 'Kenton Towne' },   { id: 3, name: 'Therese Wunsch' },   { id: 4, name: 'Benedict Kessler' },   { id: 5, name: 'Katelyn Rohan' }, ]  function MyCombobox() {`

  `const [selectedPeople, setSelectedPeople] = useState([people[0], people[1]])`

  `return (     <Combobox value={selectedPeople} onChange={setSelectedPeople} multiple>       {selectedPeople.length > 0 && (         <ul>           {selectedPeople.map((person) => (             <li key={person.id}>{person.name}</li>           ))}         </ul>       )}        <Combobox.Input />        <Combobox.Options>         {people.map((person) => (           <Combobox.Option key={person.id} value={person}>             {person.name}           </Combobox.Option>         ))}       </Combobox.Options>     </Combobox>   ) }`

The `displayValue` prop is omitted because the `selectedPeople` is already displayed in a list above the input. If you wish to display the items in the `Combobox.Input` then the `displayValue` receives an array.

`import { useState } from 'react' import { Combobox } from '@headlessui/react'  const people = [   { id: 1, name: 'Durward Reynolds' },   { id: 2, name: 'Kenton Towne' },   { id: 3, name: 'Therese Wunsch' },   { id: 4, name: 'Benedict Kessler' },   { id: 5, name: 'Katelyn Rohan' }, ]  function MyCombobox() {`

  `const [selectedPeople, setSelectedPeople] = useState([people[0], people[1]])`

  `return (     <Combobox value={selectedPeople} onChange={setSelectedPeople} multiple>       <Combobox.Input            displayValue={(people) =>            people.map((person) => person.name).join(', ')            }        />       <Combobox.Options>         {people.map((person) => (           <Combobox.Option key={person.id} value={person}>             {person.name}           </Combobox.Option>         ))}       </Combobox.Options>     </Combobox>   ) }`

This will keep the combobox open when you are selecting options, and choosing an option will toggle it in place.

Your `onChange` handler will be called with an array containing all selected options any time an option is added or removed.

[](#using-a-custom-label)
-------------------------

By default the `Combobox` will use the input contents as the label for screenreaders. If you'd like more control over what is announced to assistive technologies, use the `Combobox.Label` component.

`import { useState } from 'react' import { Combobox } from '@headlessui/react'  const people = [   { id: 1, name: 'Durward Reynolds' },   { id: 2, name: 'Kenton Towne' },   { id: 3, name: 'Therese Wunsch' },   { id: 4, name: 'Benedict Kessler' },   { id: 5, name: 'Katelyn Rohan' }, ]  function MyCombobox() {   const [selectedPerson, setSelectedPerson] = useState(people[0])   const [query, setQuery] = useState('')    const filteredPeople =     query === ''       ? people       : people.filter((person) => {           return person.name.toLowerCase().includes(query.toLowerCase())         })    return (     <Combobox value={selectedPerson} onChange={setSelectedPerson}>`

      `<Combobox.Label>Assignee:</Combobox.Label>`

      `<Combobox.Input         onChange={(event) => setQuery(event.target.value)}         displayValue={(person) => person.name}       />       <Combobox.Options>         {filteredPeople.map((person) => (           <Combobox.Option key={person.id} value={person}>             {person.name}           </Combobox.Option>         ))}       </Combobox.Options>     </Combobox>   ) }`

[](#using-with-html-forms)
--------------------------

If you add the `name` prop to your combobox, hidden `input` elements will be rendered and kept in sync with your selected value.

`import { useState } from 'react' import { Combobox } from '@headlessui/react'  const people = [   { id: 1, name: 'Durward Reynolds' },   { id: 2, name: 'Kenton Towne' },   { id: 3, name: 'Therese Wunsch' },   { id: 4, name: 'Benedict Kessler' },   { id: 5, name: 'Katelyn Rohan' }, ]  function Example() {   const [selectedPerson, setSelectedPerson] = useState(people[0])   const [query, setQuery] = useState('')    const filteredPeople =     query === ''       ? people       : people.filter((person) => {           return person.name.toLowerCase().includes(query.toLowerCase())         })    return (     <form action="/projects/1/assignee" method="post">       <Combobox         value={selectedPerson}         onChange={setSelectedPerson}`

        `name="assignee"`

      `>         <Combobox.Input           onChange={(event) => setQuery(event.target.value)}           displayValue={(person) => person.name}         />         <Combobox.Options>           {filteredPeople.map((person) => (             <Combobox.Option key={person.id} value={person}>               {person.name}             </Combobox.Option>           ))}         </Combobox.Options>       </Combobox>       <button>Submit</button>     </form>   ) }`

This lets you use a combobox inside a native HTML `<form>` and make traditional form submissions as if your combobox was a native HTML form control.

Basic values like strings will be rendered as a single hidden input containing that value, but complex values like objects will be encoded into multiple inputs using a square bracket notation for the names:

`<input type="hidden" name="assignee[id]" value="1" /> <input type="hidden" name="assignee[name]" value="Durward Reynolds" />`

[](#using-as-an-uncontrolled-component)
---------------------------------------

If you provide a `defaultValue` prop to the `Combobox` instead of a `value`, Headless UI will track its state internally for you, allowing you to use it as an [uncontrolled component](https://reactjs.org/docs/uncontrolled-components.html).

`import { useState } from 'react' import { Combobox } from '@headlessui/react'  const people = [   { id: 1, name: 'Durward Reynolds' },   { id: 2, name: 'Kenton Towne' },   { id: 3, name: 'Therese Wunsch' },   { id: 4, name: 'Benedict Kessler' },   { id: 5, name: 'Katelyn Rohan' }, ]  function Example() {   const [query, setQuery] = useState('')    const filteredPeople =     query === ''       ? people       : people.filter((person) => {           return person.name.toLowerCase().includes(query.toLowerCase())         })    return (     <form action="/projects/1/assignee" method="post">`

      `<Combobox name="assignee" defaultValue={people[0]}>`

        `<Combobox.Input           onChange={(event) => setQuery(event.target.value)}           displayValue={(person) => person.name}         />         <Combobox.Options>           {filteredPeople.map((person) => (             <Combobox.Option key={person.id} value={person}>               {person.name}             </Combobox.Option>           ))}         </Combobox.Options>       </Combobox>       <button>Submit</button>     </form>   ) }`

This can simplify your code when using the combobox [with HTML forms](#using-with-html-forms) or with form APIs that collect their state using [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData) instead of tracking it using React state.

Any `onChange` prop you provide will still be called when the component's value changes in case you need to run any side effects, but you won't need to use it to track the component's state yourself.

[](#allowing-custom-values)
---------------------------

You can allow users to enter their own value that doesn't exist in the list by including a dynamic `Combobox.Option` based on the `query` value.

`import { useState } from 'react' import { Combobox } from '@headlessui/react'  const people = [   { id: 1, name: 'Durward Reynolds' },   { id: 2, name: 'Kenton Towne' },   { id: 3, name: 'Therese Wunsch' },   { id: 4, name: 'Benedict Kessler' },   { id: 5, name: 'Katelyn Rohan' }, ]  function Example() {   const [selectedPerson, setSelectedPerson] = useState(people[0])   const [query, setQuery] = useState('')    const filteredPeople =     query === ''       ? people       : people.filter((person) => {           return person.name.toLowerCase().includes(query.toLowerCase())         })    return (     <Combobox value={selectedPerson} onChange={setSelectedPerson}>       <Combobox.Input         onChange={(event) => setQuery(event.target.value)}         displayValue={(person) => person.name}       />       <Combobox.Options>`

        `{query.length > 0 && (`

          `<Combobox.Option value={{ id: null, name: query }}>`

            `Create "{query}"`

          `</Combobox.Option>`

        `)}`

        `{filteredPeople.map((person) => (           <Combobox.Option key={person.id} value={person}>             {person.name}           </Combobox.Option>         ))}       </Combobox.Options>     </Combobox>   ) }`

[](#rendering-the-active-option-on-the-side)
--------------------------------------------

Depending on what you're building it can sometimes make sense to render additional information about the active option outside of the `<Combobox.Options>`. For example, a preview of the active option within the context of a command palette. In these situations you can read the `activeOption` render prop argument to access this information.

`import { useState } from 'react' import { Combobox } from '@headlessui/react'  const people = [   { id: 1, name: 'Durward Reynolds' },   { id: 2, name: 'Kenton Towne' },   { id: 3, name: 'Therese Wunsch' },   { id: 4, name: 'Benedict Kessler' },   { id: 5, name: 'Katelyn Rohan' }, ]  function MyCombobox() {   const [selectedPerson, setSelectedPerson] = useState(people[0])   const [query, setQuery] = useState('')    const filteredPeople =     query === ''       ? people       : people.filter((person) => {           return person.name.toLowerCase().includes(query.toLowerCase())         })    return (     <Combobox value={selectedPerson} onChange={setSelectedPerson}>`

      `{({ activeOption }) => (`

        `<>           <Combobox.Input             onChange={(event) => setQuery(event.target.value)}             displayValue={(person) => person.name}           />           <Combobox.Options>             {filteredPeople.map((person) => (               <Combobox.Option key={person.id} value={person}>                 {person.name}               </Combobox.Option>             ))}           </Combobox.Options>            {activeOption && (                <div>The current active user is: {activeOption.name}</div>              )}          </>       )}     </Combobox>   ) }`

The `activeOption` will be the `value` of the current active `Combobox.Option`.

[](#showing-hiding-the-combobox)
--------------------------------

By default, your `Combobox.Options` instance will be shown/hidden automatically based on the internal `open` state tracked within the `Combobox` component itself.

``import { useState } from 'react' import { Combobox } from '@headlessui/react'  const people = [   { id: 1, name: 'Durward Reynolds' },   { id: 2, name: 'Kenton Towne' },   { id: 3, name: 'Therese Wunsch' },   { id: 4, name: 'Benedict Kessler' },   { id: 5, name: 'Katelyn Rohan' }, ]  function MyCombobox() {   const [selectedPerson, setSelectedPerson] = useState(people[0])   const [query, setQuery] = useState('')    const filteredPeople =     query === ''       ? people       : people.filter((person) => {           return person.name.toLowerCase().includes(query.toLowerCase())         })    return (     <Combobox value={selectedPerson} onChange={setSelectedPerson}>       <Combobox.Input         onChange={(event) => setQuery(event.target.value)}         displayValue={(person) => person.name}       />        {/*         By default, the `Combobox.Options` will automatically show/hide when         typing in the `Combobox.Input`, or when pressing the `Combobox.Button`.       */}       <Combobox.Options>         {filteredPeople.map((person) => (           <Combobox.Option key={person.id} value={person}>             {person.name}           </Combobox.Option>         ))}       </Combobox.Options>     </Combobox>   ) }``

If you'd rather handle this yourself (perhaps because you need to add an extra wrapper element for one reason or another), you can add a `static` prop to the `Combobox.Options` instance to tell it to always render, and inspect the `open` render prop provided by `Combobox` to control which element is shown/hidden yourself.

`import { useState } from 'react' import { Combobox } from '@headlessui/react'  const people = [   { id: 1, name: 'Durward Reynolds' },   { id: 2, name: 'Kenton Towne' },   { id: 3, name: 'Therese Wunsch' },   { id: 4, name: 'Benedict Kessler' },   { id: 5, name: 'Katelyn Rohan' }, ]  function MyCombobox() {   const [selectedPerson, setSelectedPerson] = useState(people[0])   const [query, setQuery] = useState('')    const filteredPeople =     query === ''       ? people       : people.filter((person) => {           return person.name.toLowerCase().includes(query.toLowerCase())         })    return (     <Combobox value={selectedPerson} onChange={setSelectedPerson}>`

      `{({ open }) => (`

        ``<>           <Combobox.Input             onChange={(event) => setQuery(event.target.value)}             displayValue={(person) => person.name}           />            {open && (              <div>               {/*                 Using `static`, `Combobox.Options` are always rendered                 and the `open` state is ignored.               */}                <Combobox.Options static>                  {filteredPeople.map((person) => (                   <Combobox.Option key={person.id} value={person}>                     {person.name}                   </Combobox.Option>                 ))}               </Combobox.Options>             </div>           )}         </>       )}     </Combobox>   ) }``

[](#disabling-an-option)
------------------------

Use the `disabled` prop to disable a `Combobox.Option`. This will make it unselectable via mouse and keyboard, and it will be skipped when pressing the up/down arrows.

`import { useState } from 'react' import { Combobox } from '@headlessui/react'  const people = [   { id: 1, name: 'Durward Reynolds', unavailable: false },   { id: 2, name: 'Kenton Towne', unavailable: false },   { id: 3, name: 'Therese Wunsch', unavailable: false },   { id: 4, name: 'Benedict Kessler', unavailable: true },   { id: 5, name: 'Katelyn Rohan', unavailable: false }, ]  function MyCombobox() {   const [selectedPerson, setSelectedPerson] = useState(people[0])   const [query, setQuery] = useState('')    const filteredPeople =     query === ''       ? people       : people.filter((person) => {           return person.name.toLowerCase().includes(query.toLowerCase())         })    return (     <Combobox value={selectedPerson} onChange={setSelectedPerson}>       <Combobox.Input         onChange={(event) => setQuery(event.target.value)}         displayValue={(person) => person.name}       />       <Combobox.Options>         {filteredPeople.map((person) => (           /* Disabled options will be skipped by keyboard navigation. */           <Combobox.Option             key={person.id}             value={person}`

            `disabled={person.unavailable}`

          `>             <span className={person.unavailable ? 'opacity-75' : ''}>               {person.name}             </span>           </Combobox.Option>         ))}       </Combobox.Options>     </Combobox>   ) }`

[](#allowing-empty-values)
--------------------------

By default, once you've selected a value in a combobox there is no way to clear the combobox back to an empty value — when you clear the input and tab away, the value returns to the previously selected value.

If you want to support empty values in your combobox, use the `nullable` prop.

`import { useState } from 'react' import { Combobox } from '@headlessui/react'  const people = [   { id: 1, name: 'Durward Reynolds', unavailable: false },   { id: 2, name: 'Kenton Towne', unavailable: false },   { id: 3, name: 'Therese Wunsch', unavailable: false },   { id: 4, name: 'Benedict Kessler', unavailable: true },   { id: 5, name: 'Katelyn Rohan', unavailable: false }, ]  function MyCombobox() {   const [selectedPerson, setSelectedPerson] = useState(people[0])   const [query, setQuery] = useState('')    const filteredPeople =     query === ''       ? people       : people.filter((person) => {           return person.name.toLowerCase().includes(query.toLowerCase())         })    return (`

    `<Combobox value={selectedPerson} onChange={setSelectedPerson} nullable>`

      `<Combobox.Input         onChange={(event) => setQuery(event.target.value)}            displayValue={(person) => person?.name}        />       <Combobox.Options>         {filteredPeople.map((person) => (           <Combobox.Option key={person.id} value={person}>             {person.name}           </Combobox.Option>         ))}       </Combobox.Options>     </Combobox>   ) }`

When the `nullable` prop is used, clearing the input and navigating away from the element will invoke your `onChange` and `displayValue` callbacks with `null`.

This prop doesn't do anything when allowing [multiple values](#selecting-multiple-values) because options are toggled on and off, resulting in an empty array (rather than null) if nothing is selected.

[](#transitions)
----------------

To animate the opening/closing of the combobox panel, use the provided `Transition` component. All you need to do is wrap the `Combobox.Options` in a `<Transition>`, and the transition will be applied automatically.

`import { useState } from 'react' import { Combobox, Transition } from '@headlessui/react'  const people = [   { id: 1, name: 'Durward Reynolds' },   { id: 2, name: 'Kenton Towne' },   { id: 3, name: 'Therese Wunsch' },   { id: 4, name: 'Benedict Kessler' },   { id: 5, name: 'Katelyn Rohan' }, ]  function MyCombobox() {   const [selectedPerson, setSelectedPerson] = useState(people[0])   const [query, setQuery] = useState('')    const filteredPeople =     query === ''       ? people       : people.filter((person) => {           return person.name.toLowerCase().includes(query.toLowerCase())         })    return (     <Combobox value={selectedPerson} onChange={setSelectedPerson}>       <Combobox.Input         onChange={(event) => setQuery(event.target.value)}         displayValue={(person) => person.name}       />`

      `<Transition`

        `enter="transition duration-100 ease-out"`

        `enterFrom="transform scale-95 opacity-0"`

        `enterTo="transform scale-100 opacity-100"`

        `leave="transition duration-75 ease-out"`

        `leaveFrom="transform scale-100 opacity-100"`

        `leaveTo="transform scale-95 opacity-0"`

      `>`

        `<Combobox.Options>           {filteredPeople.map((person) => (             <Combobox.Option key={person.id} value={person}>               {person.name}             </Combobox.Option>           ))}         </Combobox.Options>        </Transition>      </Combobox>   ) }`

By default our built-in `Transition` component automatically communicates with the `Combobox` components to handle the open/closed states. However, if you require more control over this behavior, you can explicitly control it:

`import { useState } from 'react' import { Combobox, Transition } from '@headlessui/react'  const people = [   { id: 1, name: 'Durward Reynolds' },   { id: 2, name: 'Kenton Towne' },   { id: 3, name: 'Therese Wunsch' },   { id: 4, name: 'Benedict Kessler' },   { id: 5, name: 'Katelyn Rohan' }, ]  function MyCombobox() {   const [selectedPerson, setSelectedPerson] = useState(people[0])   const [query, setQuery] = useState('')    const filteredPeople =     query === ''       ? people       : people.filter((person) => {           return person.name.toLowerCase().includes(query.toLowerCase())         })    return (     <Combobox value={selectedPerson} onChange={setSelectedPerson}>`

      `{({ open }) => (`

        `<>`

          ``<Combobox.Input             onChange={(event) => setQuery(event.target.value)}             displayValue={(person) => person.name}           />           {/*             Use the `Transition` + `open` render prop argument to add transitions.           */}           <Transition                show={open}              enter="transition duration-100 ease-out"             enterFrom="transform scale-95 opacity-0"             enterTo="transform scale-100 opacity-100"             leave="transition duration-75 ease-out"             leaveFrom="transform scale-100 opacity-100"             leaveTo="transform scale-95 opacity-0"           >             {/*               Don't forget to add `static` to your `Combobox.Options`!             */}              <Combobox.Options static>                {filteredPeople.map((person) => (                 <Combobox.Option key={person.id} value={person}>                   {person.name}                 </Combobox.Option>               ))}             </Combobox.Options>           </Transition>          </>          )}      </Combobox>   ) }``

Because they're renderless, Headless UI components also compose well with other animation libraries in the React ecosystem like [Framer Motion](https://www.framer.com/motion/) and [React Spring](https://www.react-spring.io/).

[](#rendering-as-different-elements)
------------------------------------

By default, the `Combobox` and its subcomponents each render a default element that is sensible for that component.

For example, `Combobox.Label` renders a `label` by default, `Combobox.Input` renders an `input`, `Combobox.Button` renders a `button`, `Combobox.Options` renders a `ul`, and `Combobox.Option` renders a `li`. By contrast, `Combobox` _does not render an element_, and instead renders its children directly.

Use the `as` prop to render a component as a different element or as your own custom component, making sure your custom components [forward refs](https://react.dev/reference/react/forwardRef) so that Headless UI can wire things up correctly.

`import { forwardRef, useState } from 'react' import { Combobox } from '@headlessui/react'  const people = [   { id: 1, name: 'Durward Reynolds' },   { id: 2, name: 'Kenton Towne' },   { id: 3, name: 'Therese Wunsch' },   { id: 4, name: 'Benedict Kessler' },   { id: 5, name: 'Katelyn Rohan' }, ]`

`let MyCustomButton = forwardRef(function (props, ref) {`

  `return <button className="..." ref={ref} {...props} />`

`})`

`function MyCombobox() {   const [selectedPerson, setSelectedPerson] = useState(people[0])   const [query, setQuery] = useState('')    const filteredPeople =     query === ''       ? people       : people.filter((person) => {           return person.name.toLowerCase().includes(query.toLowerCase())         })    return (        <Combobox as="div" value={selectedPerson} onChange={setSelectedPerson}>        <Combobox.Input         onChange={(event) => setQuery(event.target.value)}         displayValue={(person) => person.name}       />       <Combobox.Button            as={MyCustomButton}        >         Open        </Combobox.Button>        <Combobox.Options as="div">          {filteredPeople.map((person) => (           <Combobox.Option as="span" key={person.id} value={person}>             {person.name}           </Combobox.Option>         ))}       </Combobox.Options>     </Combobox>   ) }`

To tell an element to render its children directly with no wrapper element, use a `Fragment`.

``import { useState, Fragment } from 'react' import { Combobox } from '@headlessui/react'  const people = [   { id: 1, name: 'Durward Reynolds' },   { id: 2, name: 'Kenton Towne' },   { id: 3, name: 'Therese Wunsch' },   { id: 4, name: 'Benedict Kessler' },   { id: 5, name: 'Katelyn Rohan' }, ]  function MyCombobox() {   const [selectedPerson, setSelectedPerson] = useState(people[0])   const [query, setQuery] = useState('')    const filteredPeople =     query === ''       ? people       : people.filter((person) => {           return person.name.toLowerCase().includes(query.toLowerCase())         })    return (     <Combobox value={selectedPerson} onChange={setSelectedPerson}>       {/* Render a `Fragment` instead of an `input` */}       <Combobox.Input``

        `as={Fragment}`

        `onChange={(event) => setQuery(event.target.value)}         displayValue={(person) => person.name}       >         <input />       </Combobox.Input>       <Combobox.Options>         {filteredPeople.map((person) => (           <Combobox.Option key={person.id} value={person}>             {person.name}           </Combobox.Option>         ))}       </Combobox.Options>     </Combobox>   ) }`

[](#accessibility-notes)
------------------------

### [](#focus-management)

When a Combobox is toggled open, the `Combobox.Input` stays focused.

The `Combobox.Button` is ignored for the default tab flow, this means that pressing `Tab` in the `Combobox.Input` will skip passed the `Combobox.Button`.

### [](#mouse-interaction)

Clicking a `Combobox.Button` toggles the options list open and closed. Clicking anywhere outside of the options list will close the combobox.

### [](#keyboard-interaction)

### [](#other)

All relevant ARIA attributes are automatically managed.

[](#component-api)
------------------

### [](#combobox)

The main Combobox component.

### [](#combobox-label)

A label that can be used for more control over the text your Combobox will announce to screenreaders. Its `id` attribute will be automatically generated and linked to the root `Combobox` component via the `aria-labelledby` attribute.

### [](#combobox-options)

The component that directly wraps the list of options in your custom Combobox.

### [](#combobox-option)

Used to wrap each item within your Combobox.</content>
</page>

<page>
  <title>Headless UI</title>
  <url>https://headlessui.com/v1/react/switch</url>
  <content>Switches are a pleasant interface for toggling a value between two states, and offer the same semantics and keyboard navigation as native checkbox elements.

[](#installation)
-----------------

To get started, install Headless UI via npm:

`npm install @headlessui/react`

[](#basic-example)
------------------

Switches are built using the `Switch` component. You can toggle your Switch by clicking directly on the component, or by pressing the spacebar while its focused.

Toggling the switch calls the `onChange` function with a negated version of the `checked` value.

``import { useState } from 'react' import { Switch } from '@headlessui/react'  function MyToggle() {   const [enabled, setEnabled] = useState(false)    return (     <Switch       checked={enabled}       onChange={setEnabled}       className={`${         enabled ? 'bg-blue-600' : 'bg-gray-200'       } relative inline-flex h-6 w-11 items-center rounded-full`}     >       <span className="sr-only">Enable notifications</span>       <span         className={`${           enabled ? 'translate-x-6' : 'translate-x-1'         } inline-block h-4 w-4 transform rounded-full bg-white transition`}       />     </Switch>   ) }``

[](#styling-different-states)
-----------------------------

Headless UI keeps track of a lot of state about each component, like which switch option is currently selected, whether a popover is open or closed, or which item in a menu is currently active via the keyboard.

But because the components are headless and completely unstyled out of the box, you can't _see_ this information in your UI until you provide the styles you want for each state yourself.

### [](#using-render-props)

Each component exposes information about its current state via [render props](https://reactjs.org/docs/render-props.html) that you can use to conditionally apply different styles or render different content.

For example, the `Switch` component exposes an `checked` state, which tells you if the switch is currently checked or not.

`import { useState, Fragment } from 'react' import { Switch } from '@headlessui/react'  function MyToggle() {   const [enabled, setEnabled] = useState(false)    return (     <Switch checked={enabled} onChange={setEnabled} as={Fragment}>`

      `{({ checked }) => (`

        ``/* Use the `checked` state to conditionally style the button. */         <button           className={`${              checked ? 'bg-blue-600' : 'bg-gray-200'            } relative inline-flex h-6 w-11 items-center rounded-full`}         >           <span className="sr-only">Enable notifications</span>           <span             className={`${                checked ? 'translate-x-6' : 'translate-x-1'              } inline-block h-4 w-4 transform rounded-full bg-white transition`}           />         </button>       )}     </Switch>   ) }``

For the complete render prop API for each component, see the [component API documentation](#component-api).

### [](#using-data-attributes)

Each component also exposes information about its current state via a `data-headlessui-state` attribute that you can use to conditionally apply different styles.

When any of the states in the [render prop API](#component-api) are `true`, they will be listed in this attribute as space-separated strings so you can target them with a [CSS attribute selector](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors) in the form `[attr~=value]`.

For example, here's what the `Switch` component renders when the switch is checked:

``<!-- Rendered `Switch` --> <button data-headlessui-state="checked"></button>``

If you are using [Tailwind CSS](https://tailwindcss.com/), you can use the [@headlessui/tailwindcss](https://github.com/tailwindlabs/headlessui/tree/main/packages/%40headlessui-tailwindcss) plugin to target this attribute with modifiers like `ui-checked:*`:

`import { useState } from 'react' import { Switch } from '@headlessui/react'  function MyToggle() {   const [enabled, setEnabled] = useState(false)    return (     <Switch       checked={enabled}       onChange={setEnabled}`

      `className="relative inline-flex h-6 w-11 items-center rounded-full ui-checked:bg-blue-600 ui-not-checked:bg-gray-200"`

    `>       <span className="sr-only">Enable notifications</span>        <span className="inline-block h-4 w-4 transform rounded-full bg-white transition ui-checked:translate-x-6 ui-not-checked:translate-x-1" />      </Switch>   ) }`

[](#using-a-custom-label)
-------------------------

By default, a Switch renders a `button` as well as whatever children you pass into it. This can make it harder to implement certain UIs, since the children will be nested within the button.

In these situations, you can use the `Switch.Label` component for more flexibility.

This example demonstrates how to use the `Switch.Group`, `Switch` and `Switch.Label` components to render a label as a sibling to the button. Note that `Switch.Label` works alongside a `Switch` component, and they both must be rendered within a parent `Switch.Group` component.

`import { useState } from 'react' import { Switch } from '@headlessui/react'  function MyToggle() {   const [enabled, setEnabled] = useState(false)    return (`

    `<Switch.Group>`

      ``<div className="flex items-center">          <Switch.Label className="mr-4">Enable notifications</Switch.Label>          <Switch           checked={enabled}           onChange={setEnabled}           className={`${             enabled ? 'bg-blue-600' : 'bg-gray-200'           } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}         >           <span             className={`${               enabled ? 'translate-x-6' : 'translate-x-1'             } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}           />         </Switch>       </div>      </Switch.Group>    ) }``

By default, clicking a `Switch.Label` will toggle the Switch, just like labels in native HTML checkboxes do. If you'd like to make the label non-clickable (which you might if it doesn't make sense for your design), you can add a `passive` prop to the `Switch.Label` component:

`import { useState } from 'react' import { Switch } from '@headlessui/react'  function MyToggle() {   const [enabled, setEnabled] = useState(false)    return (     <Switch.Group>`

      `<Switch.Label passive>Enable notifications</Switch.Label>`

      `<Switch checked={enabled} onChange={setEnabled}>         {/* ... */}       </Switch>     </Switch.Group>   ) }`

[](#using-with-html-forms)
--------------------------

If you add the `name` prop to your switch, a hidden `input` element will be rendered and kept in sync with the switch state.

`import { useState } from 'react' import { Switch } from '@headlessui/react'  function Example() {   const [enabled, setEnabled] = useState(true)    return (     <form action="/notification-settings" method="post">`

      `<Switch checked={enabled} onChange={setEnabled} name="notifications">`

        `{/* ... */}       </Switch>       <button>Submit</button>     </form>   ) }`

This lets you use a switch inside a native HTML `<form>` and make traditional form submissions as if your switch was a native HTML form control.

By default, the value will be `'on'` when the switch is checked, and not present when the switch is unchecked.

`<input type="hidden" name="notifications" value="on" />`

You can customize the value if needed by using the `value` prop:

`import { useState } from 'react' import { Switch } from '@headlessui/react'  function Example() {   const [enabled, setEnabled] = useState(true)    return (     <form action="/accounts" method="post">       <Switch         checked={enabled}         onChange={setEnabled}`

        `name="terms"`

        `value="accept"`

      `>         {/* ... */}       </Switch>       <button>Submit</button>     </form>   ) }`

The hidden input will then use your custom value when the switch is checked:

`<input type="hidden" name="terms" value="accept" />`

[](#using-as-an-uncontrolled-component)
---------------------------------------

If you provide a `defaultChecked` prop to the `Switch` instead of a `checked` prop, Headless UI will track its state internally for you, allowing you to use it as an [uncontrolled component](https://reactjs.org/docs/uncontrolled-components.html).

You can access the current state via the `checked` render prop on the `Switch` component.

`import { Fragment } from 'react' import { Switch } from '@headlessui/react'  function Example() {   return (     <form action="/accounts" method="post">`

      `<Switch name="terms-of-service" defaultChecked={true} as={Fragment}>`

        ``{({ checked }) => (           <button             className={`${               checked ? 'bg-blue-600' : 'bg-gray-200'             } relative inline-flex h-6 w-11 items-center rounded-full`}           >             <span className="sr-only">Enable notifications</span>             <span               className={`${                 checked ? 'translate-x-6' : 'translate-x-1'               } inline-block h-4 w-4 transform rounded-full bg-white transition`}             />           </button>         )}       </Switch>       <button>Submit</button>     </form>   ) }``

This can simplify your code when using the listbox [with HTML forms](#using-with-html-forms) or with form APIs that collect their state using [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData) instead of tracking it using React state.

Any `onChange` prop you provide will still be called when the component's value changes in case you need to run any side effects, but you won't need to use it to track the component's state yourself.

[](#transitions)
----------------

Because Switches are typically always rendered to the DOM (rather than being mounted/unmounted like other components), simple CSS transitions are often enough to animate your Switch:

`import { useState } from "react"; import { Switch } from "@headlessui/react";  function MyToggle() {   const [enabled, setEnabled] = useState(false);    return (     <Switch checked={enabled} onChange={setEnabled}>       <span         /* Transition the switch's knob on state change */`

        ``className={`transform transition ease-in-out duration-200``

          `${enabled ? "translate-x-9" : "translate-x-0"}`

        `` `} ``

      `/>       {/* ... */}     </Switch>   ); }`

Because they're renderless, Headless UI components also compose well with other animation libraries in the React ecosystem like [Framer Motion](https://www.framer.com/motion/) and [React Spring](https://www.react-spring.io/).

[](#accessibility-notes)
------------------------

### [](#labels)

By default, the children of a `Switch` will be used as the label for screen readers. If you're using `Switch.Label`, the content of your `Switch` component will be ignored by assistive technologies.

### [](#mouse-interaction)

Clicking a `Switch` or a `Switch.Label` toggles the Switch on and off.

### [](#keyboard-interaction)

### [](#other)

All relevant ARIA attributes are automatically managed.

[](#component-api)
------------------

### [](#switch)

The main Switch component.</content>
</page>

<page>
  <title>Headless UI</title>
  <url>https://headlessui.com/v1/react/disclosure</url>
  <content>A simple, accessible foundation for building custom UIs that show and hide content, like togglable accordion panels.

[](#installation)
-----------------

To get started, install Headless UI via npm:

`npm install @headlessui/react`

[](#basic-example)
------------------

Disclosures are built using the `Disclosure`, `Disclosure.Button` and `Disclosure.Panel` components.

The button will automatically open/close the panel when clicked, and all components will receive the appropriate aria-\* related attributes like `aria-expanded` and `aria-controls`.

`import { Disclosure } from '@headlessui/react'  function MyDisclosure() {   return (     <Disclosure>       <Disclosure.Button className="py-2">         Is team pricing available?       </Disclosure.Button>       <Disclosure.Panel className="text-gray-500">         Yes! You can purchase a license that you can share with your entire         team.       </Disclosure.Panel>     </Disclosure>   ) }`

[](#styling-different-states)
-----------------------------

Headless UI keeps track of a lot of state about each component, like which listbox option is currently selected, whether a popover is open or closed, or which item in a disclosure is currently active via the keyboard.

But because the components are headless and completely unstyled out of the box, you can't _see_ this information in your UI until you provide the styles you want for each state yourself.

### [](#using-render-props)

Each component exposes information about its current state via [render props](https://reactjs.org/docs/render-props.html) that you can use to conditionally apply different styles or render different content.

For example, the `Disclosure` component exposes an `open` state, which tells you if the disclosure is currently open.

`import { Disclosure } from '@headlessui/react' import { ChevronRightIcon } from '@heroicons/react/20/solid'  function MyDisclosure() {   return (     <Disclosure>`

      `{({ open }) => (`

        ``/* Use the `open` state to conditionally change the direction of an icon. */         <>           <Disclosure.Button>             Do you offer technical support?              <ChevronRightIcon className={open ? 'rotate-90 transform' : ''} />            </Disclosure.Button>           <Disclosure.Panel>No</Disclosure.Panel>         </>       )}     </Disclosure>   ) }``

For the complete render prop API for each component, see the [component API documentation](#component-api).

### [](#using-data-attributes)

Each component also exposes information about its current state via a `data-headlessui-state` attribute that you can use to conditionally apply different styles.

When any of the states in the [render prop API](#component-api) are `true`, they will be listed in this attribute as space-separated strings so you can target them with a [CSS attribute selector](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors) in the form `[attr~=value]`.

For example, here's what the `Disclosure` component renders when the disclosure is open:

``<!-- Rendered `Disclosure` --> <div data-headlessui-state="open">   <button data-headlessui-state="open">Do you offer technical support?</button>   <div data-headlessui-state="open">No</div> </div>``

If you are using [Tailwind CSS](https://tailwindcss.com/), you can use the [@headlessui/tailwindcss](https://github.com/tailwindlabs/headlessui/tree/main/packages/%40headlessui-tailwindcss) plugin to target this attribute with modifiers like `ui-open:*`:

`import { Disclosure } from '@headlessui/react' import { ChevronRightIcon } from '@heroicons/react/20/solid'  function MyDisclosure() {   return (     <Disclosure>       <Disclosure.Button>         Do you offer technical support?`

        `<ChevronRightIcon className="ui-open:rotate-90 ui-open:transform" />`

      `</Disclosure.Button>       <Disclosure.Panel>No</Disclosure.Panel>     </Disclosure>   ) }`

[](#closing-disclosures-manually)
---------------------------------

To close a disclosure manually when clicking a child of its panel, render that child as a `Disclosure.Button`. You can use the `as` prop to customize which element is being rendered.

`import { Disclosure } from '@headlessui/react' import MyLink from './MyLink'  function MyDisclosure() {   return (     <Disclosure>       <Disclosure.Button>Open mobile menu</Disclosure.Button>       <Disclosure.Panel>`

        `<Disclosure.Button as={MyLink} href="/home">`

          `Home`

        `</Disclosure.Button>`

        `{/* ... */}       </Disclosure.Panel>     </Disclosure>   ) }`

This is especially useful when using disclosures for things like mobile menus that contain links where you want the disclosure to close when navigating to the next page.

Alternatively, `Disclosure` and `Disclosure.Panel` expose a `close()` render prop which you can use to imperatively close the panel, say after running an async action:

`import { Disclosure } from '@headlessui/react'  function MyDisclosure() {   return (     <Disclosure>       <Disclosure.Button>Terms</Disclosure.Button>       <Disclosure.Panel>`

        `{({ close }) => (`

          `<button             onClick={async () => {                  await fetch('/accept-terms', { method: 'POST' })                  close()              }}           >             Read and accept           </button>         )}       </Disclosure.Panel>     </Disclosure>   ) }`

By default the `Disclosure.Button` receives focus after calling `close()`, but you can change this by passing a ref into `close(ref)`.

[](#transitions)
----------------

To animate the opening/closing of the menu panel, use the provided `Transition` component. All you need to do is wrap the `Disclosure.Panel` in a `<Transition>`, and the transition will be applied automatically.

`import { Disclosure, Transition } from '@headlessui/react'  function MyDisclosure() {   return (     <Disclosure>       <Disclosure.Button>Is team pricing available?</Disclosure.Button>`

      `<Transition`

        `enter="transition duration-100 ease-out"`

        `enterFrom="transform scale-95 opacity-0"`

        `enterTo="transform scale-100 opacity-100"`

        `leave="transition duration-75 ease-out"`

        `leaveFrom="transform scale-100 opacity-100"`

        `leaveTo="transform scale-95 opacity-0"`

      `>`

        `<Disclosure.Panel>            Yes! You can purchase a license that you can share with your entire            team.         </Disclosure.Panel>       </Transition>     </Disclosure>   ) }`

By default our built-in `Transition` component automatically communicates with the `Disclosure` components to handle the open/closed states. However, if you require more control over this behavior, you can explicitly control it:

`import { Disclosure, Transition } from '@headlessui/react'  function MyDisclosure() {   return (     <Disclosure>`

      `{({ open }) => (`

        `<>`

          ``<Disclosure.Button>Is team pricing available?</Disclosure.Button>           {/*             Use the `Transition` + `open` render prop argument to add transitions.           */}            <Transition                show={open}                enter="transition duration-100 ease-out"                enterFrom="transform scale-95 opacity-0"                enterTo="transform scale-100 opacity-100"                leave="transition duration-75 ease-out"                leaveFrom="transform scale-100 opacity-100"                leaveTo="transform scale-95 opacity-0"              >              {/*               Don't forget to add `static` to your `Disclosure.Panel`!             */}              <Disclosure.Panel static>                Yes! You can purchase a license that you can share with your                entire team.              </Disclosure.Panel>            </Transition>         </>       )}     </Disclosure>   ) }``

Because they're renderless, Headless UI components also compose well with other animation libraries in the React ecosystem like [Framer Motion](https://www.framer.com/motion/) and [React Spring](https://www.react-spring.io/).

[](#rendering-as-different-elements)
------------------------------------

`Disclosure` and its subcomponents each render a default element that is sensible for that component: the `Button` renders a `<button>`, `Panel` renders a `<div>`. By contrast, the root `Disclosure` component _does not render an element_, and instead renders its children directly by default.

Use the `as` prop to render a component as a different element or as your own custom component, making sure your custom components [forward refs](https://react.dev/reference/react/forwardRef) so that Headless UI can wire things up correctly.

`import { forwardRef, Fragment } from 'react' import { Disclosure } from '@headlessui/react'`

`let MyCustomButton = forwardRef(function (props, ref) {`

  `return <button className="..." ref={ref} {...props} />`

`})`

`function MyDisclosure() {   return (        <Disclosure as="div">        <Disclosure.Button as={MyCustomButton}>          What languages do you support?       </Disclosure.Button>        <Disclosure.Panel as="ul">          <li>HTML</li>         <li>CSS</li>         <li>JavaScript</li>       </Disclosure.Panel>     </Disclosure>   ) }`

[](#accessibility-notes)
------------------------

### [](#mouse-interaction)

Clicking a `Disclosure.Button` toggles the Disclosure's panel open and closed.

### [](#keyboard-interaction)

### [](#other)

All relevant ARIA attributes are automatically managed.

[](#component-api)
------------------

### [](#disclosure)

The main Disclosure component.

### [](#disclosure-button)

The trigger component that toggles a Disclosure.

### [](#disclosure-panel)

This component contains the contents of your disclosure.</content>
</page>

<page>
  <title>Headless UI</title>
  <url>https://headlessui.com/v1/react/dialog</url>
  <content>A fully-managed, renderless dialog component jam-packed with accessibility and keyboard features, perfect for building completely custom modal and dialog windows for your next application.

[](#installation)
-----------------

To get started, install Headless UI via npm:

`npm install @headlessui/react`

[](#basic-example)
------------------

Dialogs are built using the `Dialog`, `Dialog.Panel`, `Dialog.Title` and `Dialog.Description` components.

When the dialog's `open` prop is `true`, the contents of the dialog will render. Focus will be moved inside the dialog and trapped there as the user cycles through the focusable elements. Scroll is locked, the rest of your application UI is hidden from screen readers, and clicking outside the `Dialog.Panel` or pressing the Escape key will fire the `close` event and close the dialog.

`import { useState } from 'react' import { Dialog } from '@headlessui/react'  function MyDialog() {   let [isOpen, setIsOpen] = useState(true)    return (     <Dialog open={isOpen} onClose={() => setIsOpen(false)}>       <Dialog.Panel>         <Dialog.Title>Deactivate account</Dialog.Title>         <Dialog.Description>           This will permanently deactivate your account         </Dialog.Description>          <p>           Are you sure you want to deactivate your account? All of your data           will be permanently removed. This action cannot be undone.         </p>          <button onClick={() => setIsOpen(false)}>Deactivate</button>         <button onClick={() => setIsOpen(false)}>Cancel</button>       </Dialog.Panel>     </Dialog>   ) }`

If your dialog has a title and description, use the `Dialog.Title` and `Dialog.Description` components to provide the most accessible experience. This will link your title and description to the root dialog component via the `aria-labelledby` and `aria-describedby` attributes, ensuring their contents are announced to users using screenreaders when your dialog opens.

[](#showing-and-hiding-your-dialog)
-----------------------------------

Dialogs have no automatic management of their open/closed state. To show and hide your dialog, pass React state into the `open` prop. When `open` is true the dialog will render, and when it's false the dialog will unmount.

The `onClose` callback fires when an open dialog is dismissed, which happens when the user clicks outside the your `Dialog.Panel` or presses the Escape key. You can use this callback to set `open` back to false and close your dialog.

`import { useState } from 'react' import { Dialog } from '@headlessui/react'  function MyDialog() {   // The open/closed state lives outside of the Dialog and is managed by you`

  `let [isOpen, setIsOpen] = useState(true)`

  ``function handleDeactivate() {     // ...   }    return (     /*       Pass `isOpen` to the `open` prop, and use `onClose` to set       the state back to `false` when the user clicks outside of       the dialog or presses the escape key.     */        <Dialog open={isOpen} onClose={() => setIsOpen(false)}>        <Dialog.Panel>         <Dialog.Title>Deactivate account</Dialog.Title>         <Dialog.Description>           This will permanently deactivate your account         </Dialog.Description>         <p>           Are you sure you want to deactivate your account? All of your data           will be permanently removed. This action cannot be undone.         </p>         {/*           You can render additional buttons to dismiss your dialog by setting           `isOpen` to `false`.         */}         <button onClick={() => setIsOpen(false)}>Cancel</button>         <button onClick={handleDeactivate}>Deactivate</button>        </Dialog.Panel>      </Dialog>   ) }``

[](#styling-the-dialog)
-----------------------

Style the `Dialog` and `Dialog.Panel` components using the `className` or `style` props like you would with any other element. You can also introduce additional elements if needed to achieve a particular design.

`import { useState } from 'react' import { Dialog } from '@headlessui/react'  function MyDialog() {   let [isOpen, setIsOpen] = useState(true)    return (     <Dialog       open={isOpen}       onClose={() => setIsOpen(false)}       className="relative z-50"     >       <div className="fixed inset-0 flex w-screen items-center justify-center p-4">         <Dialog.Panel className="w-full max-w-sm rounded bg-white">           <Dialog.Title>Complete your order</Dialog.Title>            {/* ... */}         </Dialog.Panel>       </div>     </Dialog>   ) }`

Clicking outside the `Dialog.Panel` component will close the dialog, so keep that in mind when deciding which styles to apply to which elements.

[](#adding-a-backdrop)
----------------------

If you'd like to add an overlay or backdrop behind your `Dialog.Panel` to bring attention to the panel itself, we recommend using a dedicated element just for the backdrop and making it a sibling to your panel container:

`import { useState } from 'react' import { Dialog } from '@headlessui/react'  function MyDialog() {   let [isOpen, setIsOpen] = useState(true)    return (     <Dialog       open={isOpen}       onClose={() => setIsOpen(false)}       className="relative z-50"     >       {/* The backdrop, rendered as a fixed sibling to the panel container */}`

      `<div className="fixed inset-0 bg-black/30" aria-hidden="true" />`

      `{/* Full-screen container to center the panel */}       <div className="fixed inset-0 flex w-screen items-center justify-center p-4">         {/* The actual dialog panel  */}         <Dialog.Panel className="mx-auto max-w-sm rounded bg-white">           <Dialog.Title>Complete your order</Dialog.Title>           {/* ... */}         </Dialog.Panel>       </div>     </Dialog>   ) }`

This lets you [transition](#transitions) the backdrop and panel independently with their own animations, and rendering it as a sibling ensures that it doesn't interfere with your ability to scroll long dialogs.

Making a dialog scrollable is handled entirely in CSS, and the specific implementation depends on the design you are trying to achieve.

Here's an example where the entire panel container is scrollable, and the panel itself moves as you scroll:

`import { useState } from 'react' import { Dialog } from '@headlessui/react'  function MyDialog() {   let [isOpen, setIsOpen] = useState(true)    return (     <Dialog       open={isOpen}       onClose={() => setIsOpen(false)}       className="relative z-50"     >       {/* The backdrop, rendered as a fixed sibling to the panel container */}       <div className="fixed inset-0 bg-black/30" aria-hidden="true" />       {/* Full-screen scrollable container */}`

      `<div className="fixed inset-0 w-screen overflow-y-auto">`

        `{/* Container to center the panel */}          <div className="flex min-h-full items-center justify-center p-4">            {/* The actual dialog panel  */}           <Dialog.Panel className="mx-auto max-w-sm rounded bg-white">             <Dialog.Title>Complete your order</Dialog.Title>             {/* ... */}           </Dialog.Panel>         </div>       </div>     </Dialog>   ) }`

When creating a scrollable dialog with a backdrop, make sure the backdrop is rendered _behind_ the scrollable container, otherwise the scroll wheel won't work when hovering over the backdrop, and the backdrop may obscure the scrollbar and prevent users from clicking it with their mouse.

[](#managing-initial-focus)
---------------------------

For accessibility reasons, your dialog should contain at least one focusable element. By default, the `Dialog` component will focus the first focusable element (by DOM order) once it is rendered, and pressing the Tab key will cycle through all additional focusable elements within the contents.

Focus is trapped within the dialog as long as it is rendered, so tabbing to the end will start cycling back through the beginning again. All other application elements outside of the dialog will be marked as inert and thus not focusable.

If you'd like something other than the first focusable element to receive initial focus when your dialog is initially rendered, you can use the `initialFocus` ref:

`import { useState, useRef } from 'react' import { Dialog } from '@headlessui/react'  function MyDialog() {   let [isOpen, setIsOpen] = useState(true)`

  `let completeButtonRef = useRef(null)`

  ``function completeOrder() {     // ...   }    return (     /* Use `initialFocus` to force initial focus to a specific ref. */     <Dialog          initialFocus={completeButtonRef}        open={isOpen}       onClose={() => setIsOpen(false)}     >       <Dialog.Panel>         <Dialog.Title>Complete your order</Dialog.Title>         <p>Your order is all ready!</p>         <button onClick={() => setIsOpen(false)}>Cancel</button>          <button ref={completeButtonRef} onClick={completeOrder}>            Complete order         </button>       </Dialog.Panel>     </Dialog>   ) }``

[](#rendering-to-a-portal)
--------------------------

If you've ever implemented a Dialog before, you've probably come across [Portals](https://reactjs.org/docs/portals.html) in React. Portals let you invoke components from one place in the DOM (for instance deep within your application UI), but actually render to another place in the DOM entirely.

Since Dialogs and their backdrops take up the full page, you typically want to render them as a sibling to the root-most node of your React application. That way you can rely on natural DOM ordering to ensure that their content is rendered on top of your existing application UI. This also makes it easy to apply scroll locking to the rest of your application, as well as ensure that your Dialog's contents and backdrop are unobstructed to receive focus and click events.

Because of these accessibility concerns, Headless UI's `Dialog` component actually uses a Portal under-the-hood. This way we can provide features like unobstructed event handling and making the rest of your application inert. So, when using our Dialog, there's no need to use a Portal yourself! We've already taken care of it.

[](#transitions)
----------------

To animate the opening/closing of the dialog, use the [Transition component](https://headlessui.com/v1/react/transition). All you need to do is wrap the `Dialog` in a `<Transition>`, and dialog will transition automatically based on the state of the `show` prop on the `<Transition>`.

When using `<Transition>` with your dialogs, you can remove the `open` prop, as the dialog will read the `show` state from the `<Transition>` automatically.

`import { useState, Fragment } from 'react' import { Dialog, Transition } from '@headlessui/react'  function MyDialog() {   let [isOpen, setIsOpen] = useState(true)    return (`

    `<Transition`

      `show={isOpen}`

      `enter="transition duration-100 ease-out"`

      `enterFrom="transform scale-95 opacity-0"`

      `enterTo="transform scale-100 opacity-100"`

      `leave="transition duration-75 ease-out"`

      `leaveFrom="transform scale-100 opacity-100"`

      `leaveTo="transform scale-95 opacity-0"`

      `as={Fragment}`

    `>       <Dialog onClose={() => setIsOpen(false)}>         <Dialog.Panel>           <Dialog.Title>Deactivate account</Dialog.Title>           {/* ... */}         </Dialog.Panel>       </Dialog>     </Transition>   ) }`

To animate your backdrop and panel separately, wrap your `Dialog` in `Transition` and wrap your backdrop and panel each with their own `Transition.Child`:

``import { useState, Fragment } from 'react' import { Dialog, Transition } from '@headlessui/react'  function MyDialog() {   let [isOpen, setIsOpen] = useState(true)    return (     // Use the `Transition` component at the root level``

    `<Transition show={isOpen} as={Fragment}>`

      `<Dialog onClose={() => setIsOpen(false)}>         {/*           Use one Transition.Child to apply one transition to the backdrop...         */}          <Transition.Child              as={Fragment}              enter="ease-out duration-300"              enterFrom="opacity-0"              enterTo="opacity-100"              leave="ease-in duration-200"              leaveFrom="opacity-100"              leaveTo="opacity-0"            >            <div className="fixed inset-0 bg-black/30" />         </Transition.Child>         {/*           ...and another Transition.Child to apply a separate transition           to the contents.         */}          <Transition.Child              as={Fragment}              enter="ease-out duration-300"              enterFrom="opacity-0 scale-95"              enterTo="opacity-100 scale-100"              leave="ease-in duration-200"              leaveFrom="opacity-100 scale-100"              leaveTo="opacity-0 scale-95"            >            <Dialog.Panel>             <Dialog.Title>Deactivate account</Dialog.Title>             {/* ... */}           </Dialog.Panel>         </Transition.Child>       </Dialog>     </Transition>   ) }`

If you want to animate your dialogs using another animation library like [Framer Motion](https://www.framer.com/motion/) or [React Spring](https://www.react-spring.io/) and need more control, you can use the `static` prop to tell Headless UI not to manage rendering itself, and control it manually with another tool:

``import { useState } from 'react' import { Dialog } from '@headlessui/react' import { AnimatePresence, motion } from 'framer-motion'  function MyDialog() {   let [isOpen, setIsOpen] = useState(true)    return (     // Use the `Transition` component + show prop to add transitions.``

    `<AnimatePresence>`

      `{open && (`

        `<Dialog`

          `static`

          `as={motion.div}`

          `open={isOpen}`

          `onClose={() => setIsOpen(false)}         >           <div className="fixed inset-0 bg-black/30" />           <Dialog.Panel>             <Dialog.Title>Deactivate account</Dialog.Title>             {/* ... */}           </Dialog.Panel>         </Dialog>       )}      </AnimatePresence>    ) }`

The `open` prop is still used for manage scroll locking and focus trapping, but as long as `static` is present, the actual element will always be rendered regardless of the `open` value, which allows you to control it yourself externally.

[](#accessibility-notes)
------------------------

### [](#focus-management)

When the Dialog's `open` prop is `true`, the contents of the Dialog will render and focus will be moved inside the Dialog and trapped there. The first focusable element according to DOM order will receive focus, although you can use the `initialFocus` ref to control which element receives initial focus. Pressing Tab on an open Dialog cycles through all the focusable elements.

### [](#mouse-interaction)

When a `Dialog` is rendered, clicking outside of the `Dialog.Panel` will close the `Dialog`.

No mouse interaction to open the `Dialog` is included out-of-the-box, though typically you will wire a `<button />` element up with an `onClick` handler that toggles the Dialog's `open` prop to `true`.

### [](#keyboard-interaction)

### [](#other)

When a Dialog is open, scroll is locked and the rest of your application UI is hidden from screen readers.

All relevant ARIA attributes are automatically managed.

[](#component-api)
------------------

### [](#dialog)

The main Dialog component.

### [](#dialog-panel)

This indicates the panel of your actual Dialog. Clicking outside of this component will trigger the `onClose` of the `Dialog` component.

### [](#dialog-title)

This is the title for your Dialog. When this is used, it will set the `aria-labelledby` on the Dialog.

### [](#dialog-description)

This is the description for your Dialog. When this is used, it will set the `aria-describedby` on the Dialog.

### [](#dialog-overlay)

As of Headless UI v1.6, `Dialog.Overlay` is deprecated, see the [release notes](https://github.com/tailwindlabs/headlessui/releases/tag/%40headlessui%2Freact%40v1.6.0) for migration instructions.</content>
</page>

<page>
  <title>Headless UI</title>
  <url>https://headlessui.com/v1/react/popover</url>
  <content>Popovers are perfect for floating panels with arbitrary content like navigation menus, mobile menus and flyout menus.

[](#installation)
-----------------

To get started, install Headless UI via npm:

`npm install @headlessui/react`

[](#basic-example)
------------------

Popovers are built using the `Popover`, `Popover.Button`, and `Popover.Panel` components.

Clicking the `Popover.Button` will automatically open/close the `Popover.Panel`. When the panel is open, clicking anywhere outside of its contents, pressing the Escape key, or tabbing away from it will close the Popover.

`import { Popover } from '@headlessui/react'  function MyPopover() {   return (     <Popover className="relative">       <Popover.Button>Solutions</Popover.Button>        <Popover.Panel className="absolute z-10">         <div className="grid grid-cols-2">           <a href="/analytics">Analytics</a>           <a href="/engagement">Engagement</a>           <a href="/security">Security</a>           <a href="/integrations">Integrations</a>         </div>          <img src="/solutions.jpg" alt="" />       </Popover.Panel>     </Popover>   ) }`

These components are completely unstyled, so how you style your `Popover` is up to you. In our example we're using absolute positioning on the `Popover.Panel` to position it near the `Popover.Button` and not disturb the normal document flow.

[](#styling-different-states)
-----------------------------

Headless UI keeps track of a lot of state about each component, like which listbox option is currently selected, whether a popover is open or closed, or which item in a popover is currently active via the keyboard.

But because the components are headless and completely unstyled out of the box, you can't _see_ this information in your UI until you provide the styles you want for each state yourself.

### [](#using-render-props)

Each component exposes information about its current state via [render props](https://reactjs.org/docs/render-props.html) that you can use to conditionally apply different styles or render different content.

For example, the `Popover` component exposes an `open` state, which tells you if the popover is currently open.

`import { Popover } from '@headlessui/react' import { ChevronDownIcon } from '@heroicons/react/20/solid'  function MyPopover() {   return (     <Popover>`

      `{({ open }) => (`

        ``/* Use the `open` state to conditionally change the direction of the chevron icon. */         <>           <Popover.Button>             Solutions             <ChevronDownIcon className={open ? 'rotate-180 transform' : ''} />           </Popover.Button>            <Popover.Panel>              <a href="/insights">Insights</a>             <a href="/automations">Automations</a>             <a href="/reports">Reports</a>           </Popover.Panel>         </>       )}     </Popover>   ) }``

For the complete render prop API for each component, see the [component API documentation](#component-api).

### [](#using-data-attributes)

Each component also exposes information about its current state via a `data-headlessui-state` attribute that you can use to conditionally apply different styles.

When any of the states in the [render prop API](#component-api) are `true`, they will be listed in this attribute as space-separated strings so you can target them with a [CSS attribute selector](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors) in the form `[attr~=value]`.

For example, here's what the `Popover` component renders when the popover is open:

``<!-- Rendered `Popover` --> <div data-headlessui-state="open">   <button data-headlessui-state="open">Solutions</button>   <div data-headlessui-state="open">     <a href="/insights">Insights</a>     <a href="/automations">Automations</a>     <a href="/reports">Reports</a>   </div> </div>``

If you are using [Tailwind CSS](https://tailwindcss.com/), you can use the [@headlessui/tailwindcss](https://github.com/tailwindlabs/headlessui/tree/main/packages/%40headlessui-tailwindcss) plugin to target this attribute with modifiers like `ui-open:*`:

`import { Popover } from '@headlessui/react' import { ChevronDownIcon } from '@heroicons/react/20/solid'  function MyPopover() {   return (     <Popover>       <Popover.Button>         Solutions`

        `<ChevronDownIcon className="ui-open:rotate-180 ui-open:transform" />`

      `</Popover.Button>       <Popover.Panel>         <a href="/insights">Insights</a>         <a href="/automations">Automations</a>         <a href="/reports">Reports</a>       </Popover.Panel>     </Popover>   ) }`

[](#positioning-the-panel)
--------------------------

To get your Popover to actually render a floating panel near your button, you'll need to use some styling technique that relies on CSS, JS, or both. In the previous example we used CSS absolute and relative positioning so that the panel renders near the button that opened it.

For more sophisticated approaches, you might use a library like [Popper JS](https://popper.js.org/). Here we use Popper's `usePopper` hook to render our `Popover.Panel` as a floating panel near the button.

`import { useState } from 'react' import { Popover } from '@headlessui/react' import { usePopper } from 'react-popper'  function MyPopover() {`

  `let [referenceElement, setReferenceElement] = useState()`

  `let [popperElement, setPopperElement] = useState()`

  `let { styles, attributes } = usePopper(referenceElement, popperElement)`

  `return (     <Popover>        <Popover.Button ref={setReferenceElement}>Solutions</Popover.Button>        <Popover.Panel            ref={setPopperElement}            style={styles.popper}            {...attributes.popper}        >         {/* ... */}       </Popover.Panel>     </Popover>   ) }`

[](#showing-hiding-the-popover)
-------------------------------

By default, your `Popover.Panel` will be shown/hidden automatically based on the internal open state tracked within the `Popover` component itself.

``import { Popover } from '@headlessui/react'  function MyPopover() {   return (     <Popover>       <Popover.Button>Solutions</Popover.Button>        {/*         By default, the `Popover.Panel` will automatically show/hide         when the `Popover.Button` is pressed.       */}       <Popover.Panel>{/* ... */}</Popover.Panel>     </Popover>   ) }``

If you'd rather handle this yourself (perhaps because you need to add an extra wrapper element for one reason or another), you can pass a `static` prop to the `Popover.Panel` to tell it to always render, and then use the `open` render prop to control when the panel is shown/hidden yourself.

`import { Popover } from '@headlessui/react'  function MyPopover() {   return (     <Popover>       {({ open }) => (         <>           <Popover.Button>Solutions</Popover.Button>`

          `{open && (`

            `<div>`

              `{/*`

                ``Using the `static` prop, the `Popover.Panel` is always``

                ``rendered and the `open` state is ignored.``

              `*/}`

              `<Popover.Panel static>{/* ... */}</Popover.Panel>`

            `</div>`

          `)}`

        `</>       )}     </Popover>   ) }`

[](#closing-popovers-manually)
------------------------------

Since popovers can contain interactive content like form controls, we can't automatically close them when you click something inside of them like we can with `Menu` components.

To close a popover manually when clicking a child of its panel, render that child as a `Popover.Button`. You can use the `as` prop to customize which element is being rendered.

`import { Popover } from '@headlessui/react' import MyLink from './MyLink'  function MyPopover() {   return (     <Popover>       <Popover.Button>Solutions</Popover.Button>       <Popover.Panel>`

        `<Popover.Button as={MyLink} href="/insights">`

          `Insights`

        `</Popover.Button>`

        `{/* ... */}       </Popover.Panel>     </Popover>   ) }`

Alternatively, `Popover` and `Popover.Panel` expose a `close()` render prop which you can use to imperatively close the panel, say after running an async action:

`import { Popover } from '@headlessui/react'  function MyPopover() {   return (     <Popover>       <Popover.Button>Terms</Popover.Button>       <Popover.Panel>`

        `{({ close }) => (`

          `<button             onClick={async () => {                  await fetch('/accept-terms', { method: 'POST' })                  close()              }}           >             Read and accept           </button>         )}       </Popover.Panel>     </Popover>   ) }`

By default the `Popover.Button` receives focus after calling `close()`, but you can change this by passing a ref into `close(ref)`.

[](#adding-an-overlay)
----------------------

If you'd like to style a backdrop over your application UI whenever you open a Popover, use the `Popover.Overlay` component:

`import { Popover } from '@headlessui/react'  function MyPopover() {   return (     <Popover>       {({ open }) => (         <>           <Popover.Button>Solutions</Popover.Button>`

          `<Popover.Overlay className="fixed inset-0 bg-black opacity-30" />`

          `<Popover.Panel>{/* ... */}</Popover.Panel>         </>       )}     </Popover>   ) }`

In this example, we put the `Popover.Overlay` before the `Panel` in the DOM so that it doesn't cover up the panel's contents.

But like all the other components, `Popover.Overlay` is completely headless, so how you style it is up to you.

[](#transitions)
----------------

To animate the opening/closing of the popover panel, use the provided `Transition` component. All you need to do is wrap the `Popover.Panel` in a `<Transition>`, and the transition will be applied automatically.

`import { Popover, Transition } from '@headlessui/react'  function MyPopover() {   return (     <Popover>       <Popover.Button>Solutions</Popover.Button>`

      `<Transition`

        `enter="transition duration-100 ease-out"`

        `enterFrom="transform scale-95 opacity-0"`

        `enterTo="transform scale-100 opacity-100"`

        `leave="transition duration-75 ease-out"`

        `leaveFrom="transform scale-100 opacity-100"`

        `leaveTo="transform scale-95 opacity-0"`

      `>`

        `<Popover.Panel>{/* ... */}</Popover.Panel>        </Transition>      </Popover>   ) }`

By default our built-in `Transition` component automatically communicates with the `Popover` components to handle the open/closed states. However, if you require more control over this behavior, you can explicitly control it:

`import { Popover, Transition } from '@headlessui/react'  function MyPopover() {   return (     <Popover>`

      `{({ open }) => (`

        `<>`

          ``<Popover.Button>Solutions</Popover.Button>           {/* Use the `Transition` component. */}           <Transition                show={open}              enter="transition duration-100 ease-out"             enterFrom="transform scale-95 opacity-0"             enterTo="transform scale-100 opacity-100"             leave="transition duration-75 ease-out"             leaveFrom="transform scale-100 opacity-100"             leaveTo="transform scale-95 opacity-0"           >             {/* Mark this component as `static` */}              <Popover.Panel static>{/* ... */}</Popover.Panel>            </Transition>         </>       )}      </Popover>      )  }``

Because they're renderless, Headless UI components also compose well with other animation libraries in the React ecosystem like [Framer Motion](https://www.framer.com/motion/) and [React Spring](https://www.react-spring.io/).

When rendering several related Popovers, for example in a site's header navigation, use the `Popover.Group` component. This ensures panels stay open while users are tabbing between Popovers within a group, but closes any open panel once the user tabs outside of the group:

`import { Popover } from '@headlessui/react'  function MyPopover() {   return (`

    `<Popover.Group>`

      `<Popover>         <Popover.Button>Product</Popover.Button>         <Popover.Panel>{/* ... */}</Popover.Panel>       </Popover>       <Popover>         <Popover.Button>Solutions</Popover.Button>         <Popover.Panel>{/* ... */}</Popover.Panel>       </Popover>      </Popover.Group>    ) }`

[](#rendering-as-different-elements)
------------------------------------

`Popover` and its subcomponents each render a default element that is sensible for that component: the `Popover`, `Overlay`, `Panel` and `Group` components all render a `<div>`, and the `Button` component renders a `<button>`.

Use the `as` prop to render a component as a different element or as your own custom component, making sure your custom components [forward refs](https://react.dev/reference/react/forwardRef) so that Headless UI can wire things up correctly.

`import { forwardRef } from 'react' import { Popover } from '@headlessui/react'`

`​`

`let MyCustomButton = forwardRef(function (props, ref) {`

  `return <button className="..." ref={ref} {...props} />`

`})  function MyPopover() {      return (        <Popover as="nav">        <Popover.Button as={MyCustomButton}>         Solutions       </Popover.Button>       <Popover.Panel as="form">         {/* ... */}       </Popover.Panel>     </Popover>   ) }`

[](#accessibility-notes)
------------------------

### [](#focus-management)

Pressing Tab on an open panel will focus the first focusable element within the panel's contents. If a `Popover.Group` is being used, Tab cycles from the end of an open panel's content to the next Popover's button.

### [](#mouse-interaction)

Clicking a `Popover.Button` toggles a panel open and closed. Clicking anywhere outside of an open panel will close that panel.

### [](#keyboard-interaction)

### [](#other)

Nested Popovers are supported, and all panels will close correctly whenever the root panel is closed.

All relevant ARIA attributes are automatically managed.

[](#when-to-use-a-popover)
--------------------------

Here's how Popovers compare to other similar components:

*   **`<Menu />`**. Popovers are more general-purpose than Menus. Menus only support very restricted content and have specific accessibility semantics. Arrow keys also navigate a Menu's items. Menus are best for UI elements that resemble things like the menus you'd find in the title bar of most operating systems. If your floating panel has images or more markup than simple links, use a Popover.
    
*   **`<Disclosure />`**. Disclosures are useful for things that typically reflow the document, like Accordions. Popovers also have extra behavior on top of Disclosures: they render overlays, and are closed when the user either clicks the overlay (by clicking outside of the Popover's content) or presses the escape key. If your UI element needs this behavior, use a Popover instead of a Disclosure.
    
*   **`<Dialog />`**. Dialogs are meant to grab the user's full attention. They typically render a floating panel in the center of the screen, and use a backdrop to dim the rest of the application's contents. They also capture focus and prevent tabbing away from the Dialog's contents until the Dialog is dismissed. Popovers are more contextual, and are usually positioned near the element that triggered them.
    

[](#component-api)
------------------

### [](#popover)

The main Popover component.

### [](#popover-overlay)

This can be used to create an overlay for your Popover component. Clicking on the overlay will close the Popover.

### [](#popover-button)

This is the trigger component to toggle a Popover. You can also use this `Popover.Button` component inside a `Popover.Panel`, if you do so, then it will behave as a `close` button. We will also make sure to provide the correct `aria-*` attributes onto the button.

### [](#popover-panel)

This component contains the contents of your Popover.

### [](#popover-group)

Link related sibling popovers by wrapping them in a `Popover.Group`. Tabbing out of one `Popover.Panel` will focus the next popover's `Popover.Button`, and tabbing outside of the `Popover.Group` completely will close all popovers inside the group.</content>
</page>

<page>
  <title>Headless UI</title>
  <url>https://headlessui.com/v1/react/radio-group</url>
  <content>Radio Groups give you the same functionality as native HTML radio inputs, without any of the styling. They're perfect for building out custom UIs for selectors.

[](#installation)
-----------------

To get started, install Headless UI via npm:

`npm install @headlessui/react`

[](#basic-example)
------------------

Radio Groups are built using the `RadioGroup`, `RadioGroup.Label`, and `RadioGroup.Option` components.

Clicking an option will select it, and when the radio group is focused, the arrow keys will change the selected option.

`import { useState } from 'react' import { RadioGroup } from '@headlessui/react'  function MyRadioGroup() {   let [plan, setPlan] = useState('startup')    return (     <RadioGroup value={plan} onChange={setPlan}>       <RadioGroup.Label>Plan</RadioGroup.Label>       <RadioGroup.Option value="startup">         {({ checked }) => (           <span className={checked ? 'bg-blue-200' : ''}>Startup</span>         )}       </RadioGroup.Option>       <RadioGroup.Option value="business">         {({ checked }) => (           <span className={checked ? 'bg-blue-200' : ''}>Business</span>         )}       </RadioGroup.Option>       <RadioGroup.Option value="enterprise">         {({ checked }) => (           <span className={checked ? 'bg-blue-200' : ''}>Enterprise</span>         )}       </RadioGroup.Option>     </RadioGroup>   ) }`

[](#styling-different-states)
-----------------------------

Headless UI keeps track of a lot of state about each component, like which radiogroup option is currently checked, whether a popover is open or closed, or which item in a menu is currently active via the keyboard.

But because the components are headless and completely unstyled out of the box, you can't _see_ this information in your UI until you provide the styles you want for each state yourself.

### [](#using-render-props)

Each component exposes information about its current state via [render props](https://reactjs.org/docs/render-props.html) that you can use to conditionally apply different styles or render different content.

For example, the `RadioGroup.Option` component exposes an `active` state, which tells you if the option is currently focused via the mouse or keyboard, and a `checked` state, which tells you if that option matches the current `value` of the `RadioGroup`.

``import { useState, Fragment } from 'react' import { RadioGroup } from '@headlessui/react' import { CheckIcon } from '@heroicons/react/20/solid'  const plans = ['Statup', 'Business', 'Enterprise']  function MyRadioGroup() {   const [plan, setPlan] = useState(plans[0])    return (     <RadioGroup value={plan} onChange={setPlan}>       <RadioGroup.Label>Plan</RadioGroup.Label>       {plans.map((plan) => (         /* Use the `active` state to conditionally style the active option. */         /* Use the `checked` state to conditionally style the checked option. */         <RadioGroup.Option key={plan} value={plan} as={Fragment}>``

          `{({ active, checked }) => (`

            ``<li               className={`${                  active ? 'bg-blue-500 text-white' : 'bg-white text-black'                }`}             >                {checked && <CheckIcon />}                {plan}             </li>           )}         </RadioGroup.Option>       ))}     </RadioGroup>   ) }``

For the complete render prop API for each component, see the [component API documentation](#component-api).

### [](#using-data-attributes)

Each component also exposes information about its current state via a `data-headlessui-state` attribute that you can use to conditionally apply different styles.

When any of the states in the [render prop API](#component-api) are `true`, they will be listed in this attribute as space-separated strings so you can target them with a [CSS attribute selector](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors) in the form `[attr~=value]`.

For example, here's what the `RadioGroup` component with some child `RadioGroup.Option` components renders when the radio group is open and the second option is both `checked` and `active`:

``<!-- Rendered `RadioGroup` --> <div role="radiogroup">   <li data-headlessui-state="">Statup</li>   <li data-headlessui-state="active checked">Business</li>   <li data-headlessui-state="">Enterprise</li> </div>``

If you are using [Tailwind CSS](https://tailwindcss.com/), you can use the [@headlessui/tailwindcss](https://github.com/tailwindlabs/headlessui/tree/main/packages/%40headlessui-tailwindcss) plugin to target this attribute with modifiers like `ui-open:*` and `ui-active:*`:

`import { useState, Fragment } from 'react' import { RadioGroup } from '@headlessui/react' import { CheckIcon } from '@heroicons/react/20/solid'  const plans = ['Statup', 'Business', 'Enterprise']  function MyRadioGroup() {   const [plan, setPlan] = useState(plans[0])    return (     <RadioGroup value={plan} onChange={setPlan}>       <RadioGroup.Label>Plan</RadioGroup.Label>       {plans.map((plan) => (         <RadioGroup.Option           key={plan}           value={plan}`

          `className="ui-active:bg-blue-500 ui-active:text-white ui-not-active:bg-white ui-not-active:text-black"`

        `>            <CheckIcon className="hidden ui-checked:block" />            {plan}         </RadioGroup.Option>       ))}     </RadioGroup>   ) }`

[](#binding-objects-as-values)
------------------------------

Unlike native HTML form controls which only allow you to provide strings as values, Headless UI supports binding complex objects as well.

`import { useState } from 'react' import { RadioGroup } from '@headlessui/react'`

`const plans = [`

  `{ id: 1, name: 'Startup' },`

  `{ id: 2, name: 'Business' },`

  `{ id: 3, name: 'Enterprise' },`

`]`

`function MyRadioGroup() {   const [plan, setPlan] = useState(plans[0])    return (        <RadioGroup value={plan} onChange={setPlan}>        <RadioGroup.Label>Plan:</RadioGroup.Label>       {plans.map((plan) => (            <RadioGroup.Option key={plan.id} value={plan}>            {plan.name}         </RadioGroup.Option>       ))}     </RadioGroup>   ) }`

When binding objects as values, it's important to make sure that you use the _same instance_ of the object as both the `value` of the `RadioGroup` as well as the corresponding `RadioGroup.Option`, otherwise they will fail to be equal and cause the radiogroup to behave incorrectly.

To make it easier to work with different instances of the same object, you can use the `by` prop to compare the objects by a particular field instead of comparing object identity:

`import { RadioGroup } from '@headlessui/react'  const plans = [   { id: 1, name: 'Startup' },   { id: 2, name: 'Business' },   { id: 3, name: 'Enterprise' }, ]`

`function PlanPicker({ checkedPlan, onChange }) {`

  `return (        <RadioGroup value={checkedPlan} by="id" onChange={onChange}>        <RadioGroup.Label>Plan</RadioGroup.Label>       {plans.map((plan) => (         <RadioGroup.Option key={plan.id} value={plan}>           {plan.name}         </RadioGroup.Option>       ))}     </RadioGroup>   ) }`

You can also pass your own comparison function to the `by` prop if you'd like complete control over how objects are compared:

`import { RadioGroup } from '@headlessui/react'  const plans = [   { id: 1, name: 'Startup' },   { id: 2, name: 'Business' },   { id: 3, name: 'Enterprise' }, ]`

`function comparePlans(a, b) {`

  `return a.name.toLowerCase() === b.name.toLowerCase()`

`}`

`function PlanPicker({ checkedPlan, onChange }) {   return (        <RadioGroup value={checkedPlan} by={comparePlans} onChange={onChange}>        <RadioGroup.Label>Plan</RadioGroup.Label>       {plans.map((plan) => (         <RadioGroup.Option key={plan.id} value={plan}>           {plan.name}         </RadioGroup.Option>       ))}     </RadioGroup>   ) }`

[](#using-with-html-forms)
--------------------------

If you add the `name` prop to your listbox, hidden `input` elements will be rendered and kept in sync with your selected value.

`import { useState } from 'react' import { RadioGroup } from '@headlessui/react'  const plans = ['startup', 'business', 'enterprise']  function Example() {   const [plan, setPlan] = useState(plans[0])    return (     <form action="/billing" method="post">`

      `<RadioGroup value={plan} onChange={setPlan} name="plan">`

        `<RadioGroup.Label>Plan</RadioGroup.Label>         {plans.map((plan) => (           <RadioGroup.Option key={plan} value={plan}>             {plan}           </RadioGroup.Option>         ))}       </RadioGroup>       <button>Submit</button>     </form>   ) }`

This lets you use a radio group inside a native HTML `<form>` and make traditional form submissions as if your radio group was a native HTML form control.

Basic values like strings will be rendered as a single hidden input containing that value, but complex values like objects will be encoded into multiple inputs using a square bracket notation for the names.

`<input type="hidden" name="plan" value="startup" />`

[](#using-as-an-uncontrolled-component)
---------------------------------------

If you provide a `defaultValue` prop to the `RadioGroup` instead of a `value`, Headless UI will track its state internally for you, allowing you to use it as an [uncontrolled component](https://reactjs.org/docs/uncontrolled-components.html).

`import { RadioGroup } from '@headlessui/react'  const plans = [   { id: 1, name: 'Startup' },   { id: 2, name: 'Business' },   { id: 3, name: 'Enterprise' }, ]  function Example() {   return (     <form action="/companies" method="post">`

      `<RadioGroup name="plan" defaultValue={plans[0]}>`

        `<RadioGroup.Label>Plan</RadioGroup.Label>         {plans.map((plan) => (           <RadioGroup.Option key={plan.id} value={plan}>             {plan.name}           </RadioGroup.Option>         ))}       </RadioGroup>       <button>Submit</button>     </form>   ) }`

This can simplify your code when using the combobox [with HTML forms](#using-with-html-forms) or with form APIs that collect their state using [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData) instead of tracking it using React state.

Any `onChange` prop you provide will still be called when the component's value changes in case you need to run any side effects, but you won't need to use it to track the component's state yourself.

[](#using-the-label-and-description-components)
-----------------------------------------------

You can use the `RadioGroup.Label` and `RadioGroup.Description` components to mark up each option's contents. Doing so will automatically link each component to its ancestor `RadioGroup.Option` component via the `aria-labelledby` and `aria-describedby` attributes and autogenerated `id`s, improving the semantics and accessibility of your custom selector.

By default, `RatioGroup.Label` renders a `label` element and `RadioGroup.Description` renders a `<div>`. These can also be customized using the `as` prop, as described in the API docs below.

Note also that `Label`s and `Description`s can be nested. Each one will refer to its nearest ancestor component, whether than ancestor is a `RadioGroup.Option` or the root `RadioGroup` itself.

``import { useState } from 'react' import { RadioGroup } from '@headlessui/react'  function MyRadioGroup() {   const [selected, setSelected] = useState('startup')    return (     <RadioGroup value={selected} onChange={setSelected}>       {/* This label is for the root `RadioGroup`.  */}``

      `<RadioGroup.Label className="sr-only">Plan</RadioGroup.Label>`

      ``<div className="rounded-md bg-white">         <RadioGroup.Option           value="startup"           className={({ checked }) => `             ${checked ? 'border-indigo-200 bg-indigo-50' : 'border-gray-200'}             relative flex border p-4           `}         >           {({ checked }) => (             <div className="flex flex-col">               {/* This label is for the `RadioGroup.Option`.  */}                <RadioGroup.Label                    as="span"                    className={`${                    checked ? 'text-indigo-900' : 'text-gray-900'                    } block text-sm font-medium`}                  >                  Startup                </RadioGroup.Label>                {/* This description is for the `RadioGroup.Option`.  */}                <RadioGroup.Description                    as="span"                    className={`${                    checked ? 'text-indigo-700' : 'text-gray-500'                    } block text-sm`}                  >                  Up to 5 active job postings                </RadioGroup.Description>              </div>           )}         </RadioGroup.Option>       </div>     </RadioGroup>   ) }``

[](#accessibility-notes)
------------------------

### [](#mouse-interaction)

Clicking a `RadioGroup.Option` will select it.

### [](#keyboard-interaction)

All interactions apply when a `RadioGroup` component is focused.

### [](#other)

All relevant ARIA attributes are automatically managed.

[](#component-api)
------------------

### [](#radio-group)

The main Radio Group component.

### [](#radio-group-option)

The wrapper component for each selectable option.

### [](#radio-group-label)

Renders an element whose `id` attribute is automatically generated, and is then linked to its nearest ancestor `RadioGroup` or `RadioGroup.Option` component via the `aria-labelledby` attribute.

### [](#radio-group-description)

Renders an element whose `id` attribute is automatically generated, and is then linked to its nearest ancestor `RadioGroup` or `RadioGroup.Option` component via the `aria-describedby` attribute.</content>
</page>

<page>
  <title>Headless UI</title>
  <url>https://headlessui.com/v1/react/tabs</url>
  <content>Easily create accessible, fully customizable tab interfaces, with robust focus management and keyboard navigation support.

[](#installation)
-----------------

To get started, install Headless UI via npm:

`npm install @headlessui/react`

[](#basic-example)
------------------

Tabs are built using the `Tab.Group`, `Tab.List`, `Tab`, `Tab.Panels`, and `Tab.Panel` components. By default the first tab is selected, and clicking on any tab or selecting it with the keyboard will activate the corresponding panel.

`import { Tab } from '@headlessui/react'  function MyTabs() {   return (     <Tab.Group>       <Tab.List>         <Tab>Tab 1</Tab>         <Tab>Tab 2</Tab>         <Tab>Tab 3</Tab>       </Tab.List>       <Tab.Panels>         <Tab.Panel>Content 1</Tab.Panel>         <Tab.Panel>Content 2</Tab.Panel>         <Tab.Panel>Content 3</Tab.Panel>       </Tab.Panels>     </Tab.Group>   ) }`

[](#styling-different-states)
-----------------------------

Headless UI keeps track of a lot of state about each component, like which tab option is currently checked, whether a popover is open or closed, or which item in a menu is currently active via the keyboard.

But because the components are headless and completely unstyled out of the box, you can't _see_ this information in your UI until you provide the styles you want for each state yourself.

### [](#using-render-props)

Each component exposes information about its current state via [render props](https://reactjs.org/docs/render-props.html) that you can use to conditionally apply different styles or render different content.

For example, the `Tab` component exposes a `selected` state, which tells you if the tab is currently selected.

`import { Fragment } from 'react' import { Tab } from '@headlessui/react'  function MyTabs() {   return (     <Tab.Group>       <Tab.List>         <Tab as={Fragment}>`

          `{({ selected }) => (`

            ``/* Use the `selected` state to conditionally style the selected tab. */             <button               className={                  selected ? 'bg-blue-500 text-white' : 'bg-white text-black'                }             >               Tab 1             </button>           )}         </Tab>         {/* ...  */}       </Tab.List>       <Tab.Panels>         <Tab.Panel>Content 1</Tab.Panel>         {/* ... */}       </Tab.Panels>     </Tab.Group>   ) }``

For the complete render prop API for each component, see the [component API documentation](#component-api).

### [](#using-data-attributes)

Each component also exposes information about its current state via a `data-headlessui-state` attribute that you can use to conditionally apply different styles.

When any of the states in the [render prop API](#component-api) are `true`, they will be listed in this attribute as space-separated strings so you can target them with a [CSS attribute selector](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors) in the form `[attr~=value]`.

For example, here's what the `Tab.Group` component with some child `Tab` components renders when the second tab is `selected`:

``<!-- Rendered `Tab.Group` --> <div>   <button data-headlessui-state="">Tab 1</button>   <button data-headlessui-state="selected">Tab 2</button>   <button data-headlessui-state="">Tab 3</button> </div> <div>   <div data-headlessui-state="">Content 1</div>   <div data-headlessui-state="selected">Content 2</div>   <div data-headlessui-state="">Content 3</div> </div>``

If you are using [Tailwind CSS](https://tailwindcss.com/), you can use the [@headlessui/tailwindcss](https://github.com/tailwindlabs/headlessui/tree/main/packages/%40headlessui-tailwindcss) plugin to target this attribute with modifiers like `ui-open:*`:

`import { Tab } from '@headlessui/react'  function MyTabs() {   return (     <Tab.Group>       <Tab.List>`

        `<Tab className="ui-selected:bg-blue-500 ui-selected:text-white ui-not-selected:bg-white ui-not-selected:text-black">`

          `Tab 1         </Tab>         {/* ...  */}       </Tab.List>       <Tab.Panels>         <Tab.Panel>Content 1</Tab.Panel>         {/* ... */}       </Tab.Panels>     </Tab.Group>   ) }`

[](#disabling-a-tab)
--------------------

To disable a tab, use the `disabled` prop on the `Tab` component. Disabled tabs cannot be selected with the mouse, and are also skipped when navigating the tab list using the keyboard.

`import { Tab } from '@headlessui/react'  function MyTabs() {   return (     <Tab.Group>       <Tab.List>         <Tab>Tab 1</Tab>`

        `<Tab disabled>Tab 2</Tab>`

        `<Tab>Tab 3</Tab>       </Tab.List>       <Tab.Panels>         <Tab.Panel>Content 1</Tab.Panel>         <Tab.Panel>Content 2</Tab.Panel>         <Tab.Panel>Content 3</Tab.Panel>       </Tab.Panels>     </Tab.Group>   ) }`

[](#manually-activating-tabs)
-----------------------------

By default, tabs are automatically selected as the user navigates through them using the arrow keys.

If you'd rather not change the current tab until the user presses `Enter` or `Space`, use the `manual` prop on the `Tab.Group` component. This can be helpful if selecting a tab performs an expensive operation and you don't want to run it unnecessarily.

`import { Tab } from '@headlessui/react'  function MyTabs() {   return (`

    `<Tab.Group manual>`

      `<Tab.List>         <Tab>Tab 1</Tab>         <Tab>Tab 2</Tab>         <Tab>Tab 3</Tab>       </Tab.List>       <Tab.Panels>         <Tab.Panel>Content 1</Tab.Panel>         <Tab.Panel>Content 2</Tab.Panel>         <Tab.Panel>Content 3</Tab.Panel>       </Tab.Panels>     </Tab.Group>   ) }`

The `manual` prop has no impact on mouse interactions — tabs will still be selected as soon as they are clicked.

[](#vertical-tabs)
------------------

If you've styled your `Tab.List` to appear vertically, use the `vertical` prop to enable navigating with the up and down arrow keys instead of left and right, and to update the `aria-orientation` attribute for assistive technologies.

`import { Tab } from '@headlessui/react'  function MyTabs() {   return (`

    `<Tab.Group vertical>`

      `<Tab.List>         <Tab>Tab 1</Tab>         <Tab>Tab 2</Tab>         <Tab>Tab 3</Tab>       </Tab.List>       <Tab.Panels>         <Tab.Panel>Content 1</Tab.Panel>         <Tab.Panel>Content 2</Tab.Panel>         <Tab.Panel>Content 3</Tab.Panel>       </Tab.Panels>     </Tab.Group>   ) }`

[](#specifying-the-default-tab)
-------------------------------

To change which tab is selected by default, use the `defaultIndex={number}` prop on the `Tab.Group` component.

`import { Tab } from '@headlessui/react'  function MyTabs() {   return (`

    `<Tab.Group defaultIndex={1}>`

      `<Tab.List>         <Tab>Tab 1</Tab>          {/* Selects this tab by default */}          <Tab>Tab 2</Tab>          <Tab>Tab 3</Tab>       </Tab.List>       <Tab.Panels>         <Tab.Panel>Content 1</Tab.Panel>          {/* Displays this panel by default */}          <Tab.Panel>Content 2</Tab.Panel>          <Tab.Panel>Content 3</Tab.Panel>       </Tab.Panels>     </Tab.Group>   ) }`

If you happen to provide an index that is out of bounds, then the last non-disabled tab will be selected on initial render. (For example, `<Tab.Group defaultIndex={5}` in the example above would render the third panel as selected.)

[](#listening-for-changes)
--------------------------

To run a function whenever the selected tab changes, use the `onChange` prop on the `Tab.Group` component.

`import { Tab } from '@headlessui/react'  function MyTabs() {   return (     <Tab.Group`

      `onChange={(index) => {`

        `console.log('Changed selected tab to:', index)`

      `}}`

    `>       <Tab.List>         <Tab>Tab 1</Tab>         <Tab>Tab 2</Tab>         <Tab>Tab 3</Tab>       </Tab.List>       <Tab.Panels>         <Tab.Panel>Content 1</Tab.Panel>         <Tab.Panel>Content 2</Tab.Panel>         <Tab.Panel>Content 3</Tab.Panel>       </Tab.Panels>     </Tab.Group>   ) }`

[](#controlling-the-active-tab)
-------------------------------

The tabs component can also be used as a controlled component. To do this, provide the `selectedIndex` and manage the state yourself.

`import { useState } from 'react' import { Tab } from '@headlessui/react'  function MyTabs() {`

  `const [selectedIndex, setSelectedIndex] = useState(0)`

  `return (        <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>        <Tab.List>         <Tab>Tab 1</Tab>         <Tab>Tab 2</Tab>         <Tab>Tab 3</Tab>       </Tab.List>       <Tab.Panels>         <Tab.Panel>Content 1</Tab.Panel>         <Tab.Panel>Content 2</Tab.Panel>         <Tab.Panel>Content 3</Tab.Panel>       </Tab.Panels>     </Tab.Group>   ) }`

[](#accessibility-notes)
------------------------

### [](#mouse-interaction)

Clicking a `Tab` will select that tab and display the corresponding `Tab.Panel`.

### [](#keyboard-interaction)

All interactions apply when a `Tab` component is focused.

### [](#other)

All relevant ARIA attributes are automatically managed.

For a full reference on all accessibility features implemented in `Tabs`, see [the ARIA spec on Tabs](https://www.w3.org/TR/wai-aria-practices-1.2/#tabpanel).

[](#component-api)
------------------

### [](#tab-group)

The main Tab.Group component.</content>
</page>

<page>
  <title>Headless UI</title>
  <url>https://headlessui.com/v1/react/transition</url>
  <content>The Transition component lets you add enter/leave transitions to conditionally rendered elements, using CSS classes to control the actual transition styles in the different stages of the transition.

[](#installation)
-----------------

To get started, install Headless UI via npm:

`npm install @headlessui/react`

[](#basic-example)
------------------

The `Transition` accepts a `show` prop that controls whether the children should be shown or hidden, and a set of lifecycle props (like `enterFrom`, and `leaveTo`) that let you add CSS classes at specific phases of a transition.

`import { Transition } from '@headlessui/react' import { useState } from 'react'  function MyComponent() {   const [isShowing, setIsShowing] = useState(false)    return (     <>       <button onClick={() => setIsShowing((isShowing) => !isShowing)}>         Toggle       </button>       <Transition         show={isShowing}         enter="transition-opacity duration-75"         enterFrom="opacity-0"         enterTo="opacity-100"         leave="transition-opacity duration-150"         leaveFrom="opacity-100"         leaveTo="opacity-0"       >         I will fade in and out       </Transition>     </>   ) }`

[](#showing-and-hiding-content)
-------------------------------

Wrap the content that should be conditionally rendered in a `<Transition>` component, and use the `show` prop to control whether the content should be visible or hidden.

`import { Transition } from '@headlessui/react' import { useState } from 'react'  function MyComponent() {   const [isShowing, setIsShowing] = useState(false)    return (     <>       <button onClick={() => setIsShowing((isShowing) => !isShowing)}>`

        `Toggle`

      `</button>       <Transition show={isShowing}>I will appear and disappear.</Transition>     </>   ) }`

[](#rendering-as-a-different-element)
-------------------------------------

By default, the transition components will render a `div` element.

Use the `as` prop to render a component as a different element or as your own custom component, making sure your custom components [forward refs](https://react.dev/reference/react/forwardRef) so that Headless UI can wire things up correctly.

`import { forwardRef, useState, Fragment } from 'react' import { Dialog, Transition } from '@headlessui/react'`

`let MyDialogPanel = forwardRef(function (props, ref) {`

  `return <Dialog.Panel className="…" ref={ref} {...props} />`

`})`

`function MyDialog() {   let [isOpen, setIsOpen] = useState(true)    return (     <Transition          as={Dialog}        show={isOpen}       onClose={() => setIsOpen(false)}     >       <Transition.Child            as={MyDialogPanel}          enter="ease-out duration-300"         enterFrom="opacity-0 scale-95"         enterTo="opacity-100 scale-100"         leave="ease-in duration-200"         leaveFrom="opacity-100 scale-100"         leaveTo="opacity-0 scale-95"       >         <Dialog.Title>Deactivate account</Dialog.Title>         {/* ... */}       </Transition.Child>     </Transition>   ) }`

[](#animating-transitions)
--------------------------

By default, a `Transition` will enter and leave instantly, which is probably not what you're looking for if you're using this component.

To animate your enter/leave transitions, add classes that provide the styling for each phase of the transitions using these props:

*   **enter**: Applied the entire time an element is entering. Usually you define your duration and what properties you want to transition here, for example `transition-opacity duration-75`.
*   **enterFrom**: The starting point to enter from, for example `opacity-0` if something should fade in.
*   **enterTo**: The ending point to enter to, for example `opacity-100` after fading in.
*   **leave**: Applied the entire time an element is leaving. Usually you define your duration and what properties you want to transition here, for example `transition-opacity duration-75`.
*   **leaveFrom**: The starting point to leave from, for example `opacity-100` if something should fade out.
*   **leaveTo**: The ending point to leave to, for example `opacity-0` after fading out.

Here's an example:

`import { Transition } from '@headlessui/react' import { useState } from 'react'  function MyComponent() {   const [isShowing, setIsShowing] = useState(false)    return (     <>       <button onClick={() => setIsShowing((isShowing) => !isShowing)}>         Toggle       </button>`

      `<Transition`

        `show={isShowing}`

        `enter="transition-opacity duration-75"`

        `enterFrom="opacity-0"`

        `enterTo="opacity-100"`

        `leave="transition-opacity duration-150"`

        `leaveFrom="opacity-100"         leaveTo="opacity-0"       >         I will fade in and out       </Transition>     </>   ) }`

In this example, the transitioning element will take 75ms to enter (that's the `duration-75` class), and will transition the opacity property during that time (that's `transition-opacity`).

It will start completely transparent before entering (that's `opacity-0` in the `enterFrom` phase), and fade in to completely opaque (`opacity-100`) when finished (that's the `enterTo` phase).

When the element is being removed (the `leave` phase), it will transition the opacity property, and spend 150ms doing it (`transition-opacity duration-150`).

It will start as completely opaque (the `opacity-100` in the `leaveFrom` phase), and finish as completely transparent (the `opacity-0` in the `leaveTo` phase).

All of these props are optional, and will default to just an empty string.

[](#co-ordinating-multiple-transitions)
---------------------------------------

Sometimes you need to transition multiple elements with different animations but all based on the same state. For example, say the user clicks a button to open a sidebar that slides over the screen, and you also need to fade-in a background overlay at the same time.

You can do this by wrapping the related elements with a parent `Transition` component, and wrapping each child that needs its own transition styles with a `Transition.Child` component, which will automatically communicate with the parent `Transition` and inherit the parent's `show` state.

``import { Transition } from '@headlessui/react'  function Sidebar({ isShowing }) {   return (     /* The `show` prop controls all nested `Transition.Child` components. */     <Transition show={isShowing}>       {/* Background overlay */}       <Transition.Child         enter="transition-opacity ease-linear duration-300"         enterFrom="opacity-0"         enterTo="opacity-100"         leave="transition-opacity ease-linear duration-300"         leaveFrom="opacity-100"         leaveTo="opacity-0"       >         {/* ... */}       </Transition.Child>        {/* Sliding sidebar */}       <Transition.Child         enter="transition ease-in-out duration-300 transform"         enterFrom="-translate-x-full"         enterTo="translate-x-0"         leave="transition ease-in-out duration-300 transform"         leaveFrom="translate-x-0"         leaveTo="-translate-x-full"       >         {/* ... */}       </Transition.Child>     </Transition>   ) }``

The `Transition.Child` component has the exact same API as the `Transition` component, but with no `show` prop, since the `show` value is controlled by the parent.

Parent `Transition` components will always automatically wait for all children to finish transitioning before unmounting, so you don't need to manage any of that timing yourself.

[](#transitioning-on-initial-mount)
-----------------------------------

If you want an element to transition the very first time it's rendered, set the `appear` prop to `true`.

This is useful if you want something to transition in on initial page load, or when its parent is conditionally rendered.

`import { Transition } from '@headlessui/react'  function MyComponent({ isShowing }) {   return (     <Transition`

      `appear={true}`

      `show={isShowing}       enter="transition-opacity duration-75"       enterFrom="opacity-0"       enterTo="opacity-100"       leave="transition-opacity duration-150"       leaveFrom="opacity-100"       leaveTo="opacity-0"     >       {/* Your content goes here*/}     </Transition>   ) }`

[](#component-api)
------------------

### [](#transition)</content>
</page>