use tauri::{
    menu::{Menu, MenuItem},
    tray::TrayIconBuilder,
    Emitter, Manager,
};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            // Build Native System Tray for Windows / Desktop
            let open_item = MenuItem::with_id(app, "open", "Abrir pumpkin", true, None::<&str>)?;
            let mute_item = MenuItem::with_id(app, "mute", "Mutar / Desmutar microfone", true, None::<&str>)?;
            let leave_item = MenuItem::with_id(app, "leave", "Desconectar do canal de voz", true, None::<&str>)?;
            let quit_item = MenuItem::with_id(app, "quit", "Sair", true, None::<&str>)?;

            let tray_menu = Menu::with_items(app, &[&open_item, &mute_item, &leave_item, &quit_item])?;

            let _tray = TrayIconBuilder::new()
                .menu(&tray_menu)
                .show_menu_on_left_click(false)
                .on_menu_event(|app, event| match event.id.as_ref() {
                    "open" => {
                        if let Some(window) = app.get_webview_window("main") {
                            let _ = window.show();
                            let _ = window.set_focus();
                        }
                    }
                    "mute" => {
                        let _ = app.emit("pumpkin://tray/toggle-mute", ());
                    }
                    "leave" => {
                        let _ = app.emit("pumpkin://tray/leave-voice", ());
                    }
                    "quit" => {
                        let _ = app.emit("pumpkin://tray/shutdown", ());
                        app.exit(0);
                    }
                    _ => {}
                })
                .build(app)?;

            Ok(())
        })
        .on_window_event(|window, event| match event {
            tauri::WindowEvent::CloseRequested { api, .. } => {
                // Prevent abrupt close, minimize to tray gracefully
                #[cfg(not(mobile))]
                {
                    let _ = window.hide();
                    api.prevent_close();
                }
            }
            _ => {}
        })
        .run(tauri::generate_context!())
        .expect("error while running pumpkin tauri application");
}
