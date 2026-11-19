package com.weishuai.guitartuner;

import android.Manifest;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.view.WindowManager;
import android.webkit.PermissionRequest;
import android.webkit.WebView;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.BridgeWebChromeClient;

public class MainActivity extends BridgeActivity {
    private static final int REQ_AUDIO = 1002;
    private PermissionRequest pendingAudioRequest;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // 兼容鸿蒙：强制绘制系统栏背景，避免部分 ROM 装饰冲突
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                getWindow().addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
            }
        } catch (Throwable ignored) {}

        // 1) App 启动即申请系统级麦克风权限（传统 requestPermissions，鸿蒙兼容层支持良好）
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.RECORD_AUDIO)
                != PackageManager.PERMISSION_GRANTED) {
            try {
                ActivityCompat.requestPermissions(this,
                        new String[]{Manifest.permission.RECORD_AUDIO}, REQ_AUDIO);
            } catch (Throwable ignored) {}
        }

        // 2) 关键修复：覆盖 Capacitor 的 WebChromeClient.onPermissionRequest。
        // 原实现用 AndroidX ActivityResult API 再弹一次权限框，鸿蒙 4.2 兼容层支持不完整，
        // 即使系统权限已授予，仍会 request.deny() → getUserMedia 抛 NotAllowedError。
        // 这里改为：系统权限已授予就直接 grant，绕开有问题的 ActivityResult launcher。
        try {
            WebView webView = getBridge().getWebView();
            webView.setWebChromeClient(new BridgeWebChromeClient(getBridge()) {
                @Override
                public void onPermissionRequest(final PermissionRequest request) {
                    boolean granted = Build.VERSION.SDK_INT < Build.VERSION_CODES.M
                            || ContextCompat.checkSelfPermission(
                                    MainActivity.this, Manifest.permission.RECORD_AUDIO)
                            == PackageManager.PERMISSION_GRANTED;
                    if (granted) {
                        request.grant(request.getResources());
                    } else {
                        // 兜底：系统权限仍未授予时用传统方式申请，回调后再 grant/deny
                        pendingAudioRequest = request;
                        try {
                            ActivityCompat.requestPermissions(MainActivity.this,
                                    new String[]{Manifest.permission.RECORD_AUDIO}, REQ_AUDIO);
                        } catch (Throwable t) {
                            request.deny();
                            pendingAudioRequest = null;
                        }
                    }
                }
            });
        } catch (Throwable ignored) {}
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == REQ_AUDIO && pendingAudioRequest != null) {
            boolean ok = grantResults.length > 0
                    && grantResults[0] == PackageManager.PERMISSION_GRANTED;
            if (ok) {
                pendingAudioRequest.grant(pendingAudioRequest.getResources());
            } else {
                pendingAudioRequest.deny();
            }
            pendingAudioRequest = null;
        }
    }
}
