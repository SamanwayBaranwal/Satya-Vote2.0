# ============================================================
# SATYA VOTE 2.0 — Complete Asset Rename Script
# Run this in PowerShell inside your images folder
# HOW TO USE:
# 1. Open PowerShell
# 2. cd into the folder where all your images are
# 3. Paste this entire script and press Enter
# ============================================================

# ── BATCH 1: Logo & Previous Black/White Logo ──
Rename-Item "ChatGPT_Image_Jun_21__2026__01_45_41_PM.png" "satya-vote-logo-monochrome-white-on-dark.png"

# ── BATCH 2: Lotus Icons ──
Rename-Item "ChatGPT_Image_Jun_21__2026__01_46_34_PM.png" "satya-vote-icon-only.png"
Rename-Item "ChatGPT_Image_Jun_21__2026__01_46_27_PM.png" "satya-vote-app-icon-1024x1024.png"
Rename-Item "ChatGPT_Image_Jun_21__2026__01_46_20_PM.png" "satya-vote-icon-only-v2.png"

# ── BATCH 3: Neta Ji Mascot (Election Administrator) ──
Rename-Item "ChatGPT_Image_Jun_21__2026__01_47_06_PM.png" "mascot-netaji-idle.png"
Rename-Item "ChatGPT_Image_Jun_21__2026__01_47_02_PM.png" "mascot-netaji-thinking.png"
Rename-Item "ChatGPT_Image_Jun_21__2026__01_46_57_PM.png" "mascot-netaji-celebration.png"
Rename-Item "ChatGPT_Image_Jun_21__2026__01_46_54_PM.png" "mascot-netaji-approval.png"
Rename-Item "ChatGPT_Image_Jun_21__2026__01_46_51_PM.png" "mascot-netaji-talking.png"

# ── BATCH 4: Matdata Ji Mascot (Voter) ──
Rename-Item "ChatGPT_Image_Jun_21__2026__01_47_24_PM.png" "mascot-matdata-idle.png"
Rename-Item "ChatGPT_Image_Jun_21__2026__01_47_26_PM.png" "mascot-matdata-happy.png"
Rename-Item "ChatGPT_Image_Jun_21__2026__01_47_28_PM.png" "mascot-matdata-waiting.png"
Rename-Item "ChatGPT_Image_Jun_21__2026__01_47_30_PM.png" "mascot-matdata-waiting-v2.png"

# ── BATCH 5: Election Status Icons ──
Rename-Item "ChatGPT_Image_Jun_21__2026__01_48_14_PM__1_.png" "icon-status-ended-election.png"
Rename-Item "ChatGPT_Image_Jun_21__2026__01_48_15_PM.png"     "icon-status-winner.png"
Rename-Item "ChatGPT_Image_Jun_21__2026__01_48_13_PM.png"     "icon-status-upcoming-election.png"
Rename-Item "ChatGPT_Image_Jun_21__2026__01_48_18_PM.png"     "icon-status-live-election.png"

# ── BATCH 6: Empty State Illustrations ──
Rename-Item "ChatGPT_Image_Jun_21__2026__01_48_16_PM__1_.png" "empty-state-no-elections.png"
Rename-Item "ChatGPT_Image_Jun_21__2026__01_48_16_PM.png"     "empty-state-no-elections-v2.png"
Rename-Item "ChatGPT_Image_Jun_21__2026__01_48_14_PM.png"     "empty-state-no-elections-v3-locked.png"

# ── BATCH 7: Feature Illustrations ──
Rename-Item "ChatGPT_Image_Jun_21__2026__01_48_02_PM.png" "illustration-identity-verified-badge.png"
Rename-Item "ChatGPT_Image_Jun_21__2026__01_48_04_PM.png" "illustration-realtime-voting-live.png"
Rename-Item "ChatGPT_Image_Jun_21__2026__01_48_05_PM.png" "illustration-transparent-blockchain.png"
Rename-Item "ChatGPT_Image_Jun_21__2026__01_48_00_PM__1_.png" "illustration-secure-wallet.png"
Rename-Item "ChatGPT_Image_Jun_21__2026__01_48_00_PM.png"     "illustration-tamper-proof.png"
Rename-Item "ChatGPT_Image_Jun_21__2026__01_48_01_PM.png"     "illustration-identity-verified.png"
Rename-Item "ChatGPT_Image_Jun_21__2026__01_48_03_PM.png"     "illustration-transparent-v2.png"

# ── BATCH 8: Adhyaksh Mascot (Neutral Authority) ──
Rename-Item "ChatGPT_Image_Jun_21__2026__01_47_58_PM.png" "mascot-adhyaksh-results-announcement.png"
Rename-Item "ChatGPT_Image_Jun_21__2026__01_47_56_PM.png" "mascot-adhyaksh-gavel-raised.png"
Rename-Item "ChatGPT_Image_Jun_21__2026__01_47_55_PM.png" "mascot-adhyaksh-standing.png"
Rename-Item "ChatGPT_Image_Jun_21__2026__01_47_51_PM.png" "mascot-adhyaksh-talking.png"
Rename-Item "ChatGPT_Image_Jun_21__2026__01_47_52_PM.png" "mascot-adhyaksh-sitting.png"
Rename-Item "ChatGPT_Image_Jun_21__2026__01_47_49_PM.png" "mascot-adhyaksh-sitting-v2.png"

Write-Host ""
Write-Host "DONE! All Satya Vote assets renamed successfully." -ForegroundColor Green
Write-Host "Total files renamed: 33" -ForegroundColor Green
Write-Host ""
Write-Host "Duplicates to manually review and delete:" -ForegroundColor Yellow
Write-Host "  satya-vote-icon-only.png vs satya-vote-icon-only-v2.png" -ForegroundColor Yellow
Write-Host "  mascot-matdata-waiting.png vs mascot-matdata-waiting-v2.png" -ForegroundColor Yellow
Write-Host "  empty-state-no-elections.png vs empty-state-no-elections-v2.png vs empty-state-no-elections-v3-locked.png" -ForegroundColor Yellow
Write-Host "  mascot-adhyaksh-sitting.png vs mascot-adhyaksh-sitting-v2.png" -ForegroundColor Yellow
Write-Host "  illustration-transparent.png vs illustration-transparent-v2.png" -ForegroundColor Yellow
