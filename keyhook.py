import os
import pyxhook

def OnKeyPress(event):
    print('{}\n'.format(event.Key))

# create a hook manager object
new_hook = pyxhook.HookManager()
new_hook.KeyDown = OnKeyPress

cancel_key = ord(
    os.environ.get(
        'pylogger_cancel',
        'c'
    )[0]
)

new_hook.HookKeyboard()
try:
    new_hook.start()         # start the hook
except KeyboardInterrupt:
    # User cancelled from command line.
    pass
except Exception as ex:
    # Write exceptions to the log file, for analysis later.
    msg = 'Error while catching events:\n  {}'.format(ex)
    pyxhook.print_err(msg)