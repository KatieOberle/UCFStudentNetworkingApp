import 'package:flutter/material.dart';

/// Minimal student information needed by the report form.
class ReportStudent {
  final String id;
  final String firstName;
  final String lastName;

  const ReportStudent({
    required this.id,
    required this.firstName,
    required this.lastName,
  });
}

class ReportData {
  final String reportedUserId;
  final String reason;
  final String details;

  const ReportData({
    required this.reportedUserId,
    required this.reason,
    required this.details,
  });

  /// Payload matching POST /api/reports/path.
  Map<String, dynamic> toJson() => {
        'reportedUserId': reportedUserId,
        'reason': reason,
        'description': details,
      };
}

class ReportUserPage extends StatefulWidget {
  final ReportStudent? student;
  final VoidCallback? onBackClick;
  final Future<void> Function(ReportData report)? onSubmitReport;

  const ReportUserPage({
    super.key,
    required this.student,
    this.onBackClick,
    this.onSubmitReport,
  });

  @override
  State<ReportUserPage> createState() => _ReportUserPageState();
}

class _ReportUserPageState extends State<ReportUserPage> {
  final TextEditingController _detailsController = TextEditingController();
  String _reason = '';
  String _error = '';
  bool _submitting = false;

  void _goBack() {
    if (widget.onBackClick != null) {
      widget.onBackClick!();
    } else {
      Navigator.of(context).maybePop();
    }
  }

  Future<void> _handleSubmit() async {
    setState(() => _error = '');

    final student = widget.student;
    if (student == null) {
      setState(() => _error = 'No student selected.');
      return;
    }
    if (_reason.isEmpty) {
      setState(() => _error = 'Please select a reason for your report.');
      return;
    }
    final details = _detailsController.text.trim();
    if (details.length < 10) {
      setState(() => _error = 'Please provide at least 10 characters of details.');
      return;
    }
    if (widget.onSubmitReport == null) {
      setState(() => _error = 'Reporting is not connected to the server yet.');
      return;
    }

    setState(() => _submitting = true);
    try {
      await widget.onSubmitReport!(ReportData(
        reportedUserId: student.id,
        reason: _reason,
        details: details,
      ));
      if (!mounted) return;
      _goBack();
    } catch (_) {
      if (!mounted) return;
      setState(() => _error = 'Unable to submit your report. Please try again.');
    } finally {
      if (mounted) setState(() => _submitting = false);
    }
  }

  @override
  void dispose() {
    _detailsController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final student = widget.student;
    return Scaffold(
      appBar: AppBar(
        title: const Text('KnightLink'),
        actions: [
          TextButton(
            onPressed: _goBack,
            child: const Text('Back to Profile'),
          ),
        ],
      ),
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 720),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Text('Report User', style: Theme.of(context).textTheme.headlineMedium),
                const SizedBox(height: 12),
                const Text('Help keep KnightLink safe and respectful for the UCF community.'),
                const SizedBox(height: 32),
                if (student == null) ...[
                  const Text('No student selected for reporting.'),
                  const SizedBox(height: 16),
                  OutlinedButton(onPressed: _goBack, child: const Text('Back to Search')),
                ] else ...[
                  Text.rich(TextSpan(children: [
                    const TextSpan(text: 'Reporting: '),
                    TextSpan(
                      text: '${student.firstName} ${student.lastName}',
                      style: const TextStyle(fontWeight: FontWeight.bold),
                    ),
                  ])),
                  const SizedBox(height: 24),
                  const Text('Reason for Report'),
                  const SizedBox(height: 8),
                  DropdownButtonFormField<String>(
                    value: _reason,
                    isExpanded: true,
                    decoration: const InputDecoration(border: OutlineInputBorder()),
                    items: const [
                      DropdownMenuItem(value: '', child: Text('Select a reason')),
                      DropdownMenuItem(value: 'harassment', child: Text('Harassment or Bullying')),
                      DropdownMenuItem(value: 'spam', child: Text('Spam or Unwanted Content')),
                      DropdownMenuItem(value: 'impersonation', child: Text('Impersonation')),
                      DropdownMenuItem(value: 'inappropriate', child: Text('Inappropriate Content')),
                      DropdownMenuItem(value: 'other', child: Text('Other')),
                    ],
                    onChanged: _submitting ? null : (value) => setState(() => _reason = value ?? ''),
                  ),
                  const SizedBox(height: 20),
                  const Text('Additional Details'),
                  const SizedBox(height: 8),
                  TextField(
                    controller: _detailsController,
                    maxLines: 6,
                    maxLength: 2000,
                    enabled: !_submitting,
                    decoration: const InputDecoration(
                      hintText: 'Describe what happened...',
                      border: OutlineInputBorder(),
                    ),
                  ),
                  const Text('Please provide enough information for moderators to review your report.'),
                  if (_error.isNotEmpty) ...[
                    const SizedBox(height: 16),
                    Text(_error, style: TextStyle(color: Theme.of(context).colorScheme.error)),
                  ],
                  const SizedBox(height: 24),
                  Wrap(
                    spacing: 12,
                    runSpacing: 8,
                    children: [
                      OutlinedButton(onPressed: _submitting ? null : _goBack, child: const Text('Cancel')),
                      FilledButton(
                        onPressed: _submitting ? null : _handleSubmit,
                        child: Text(_submitting ? 'Submitting...' : 'Submit Report'),
                      ),
                    ],
                  ),
                ],
              ],
            ),
          ),
        ),
      ),
    );
  }
}
